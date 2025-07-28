const CompanyProfile = require('../models/CompanyProfile');
const bcrypt = require('bcrypt');


const createCompanyProfile = async (req, res) => {
  try {
    const {
      companyName, emailId, password, website, companyType,
      mobileNumber, whatsappNumber, address,
      state, city, nation, pincode, aboutCompany,
      socialYahoo, socialFacebook, socialInstagram,
      socialTwitter, socialYoutube
    } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const logoUrl = req.file ? req.file.filename : null;

    const profile = await CompanyProfile.create({
      userId: req.user.id,
      logoUrl,
      companyName,
      emailId,
      password: hashedPassword,
      website,
      companyType,
      mobileNumber,
      whatsappNumber,
      address,
      state,
      city,
      nation,
      pincode,
      aboutCompany,
      socialYahoo,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      socialYoutube
    });

    const data = profile.toJSON();
    data.socialLinks = {
      Yahoo: data.socialYahoo || '',
      Facebook: data.socialFacebook || '',
      Instagram: data.socialInstagram || '',
      Twitter: data.socialTwitter || '',
      YouTube: data.socialYoutube || '',
    };

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating company profile:', error);
    res.status(500).json({ message: 'Error creating company profile', error });
  }
};


const getAllCompanyProfiles = async (req, res) => {
  try {
    if (req.user.role === 'superadmin') {
      const profiles = await CompanyProfile.findAll();

      const enriched = profiles.map(profile => {
        const data = profile.toJSON();
        data.socialLinks = {
          Yahoo: data.socialYahoo || '',
          Facebook: data.socialFacebook || '',
          Instagram: data.socialInstagram || '',
          Twitter: data.socialTwitter || '',
          YouTube: data.socialYoutube || '',
        };
        return data;
      });

      return res.status(200).json(enriched);
    }

    if (req.user.role === 'admin') {

      const profile = await CompanyProfile.findOne({ where: { userId: req.user.userId } });

      if (!profile) {
        return res.status(404).json({ message: 'Company profile not found for this admin' });
      }

      const data = profile.toJSON();
      data.socialLinks = {
        Yahoo: data.socialYahoo || '',
        Facebook: data.socialFacebook || '',
        Instagram: data.socialInstagram || '',
        Twitter: data.socialTwitter || '',
        YouTube: data.socialYoutube || '',
      };

      return res.status(200).json([data]);
    }

    return res.status(403).json({ message: 'Unauthorized role' });
  } catch (error) {
    console.error('Error fetching company profiles:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCompanyProfileById = async (req, res) => {
  try {
    const profile = await CompanyProfile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const data = profile.toJSON();
    data.socialLinks = {
      Yahoo: data.socialYahoo || '',
      Facebook: data.socialFacebook || '',
      Instagram: data.socialInstagram || '',
      Twitter: data.socialTwitter || '',
      YouTube: data.socialYoutube || '',
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

const updateCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await CompanyProfile.findByPk(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    let {
      companyName, emailId, password, website, companyType,
      mobileNumber, whatsappNumber, address,
      state, city, nation, pincode, aboutCompany,
      socialYahoo, socialFacebook, socialInstagram,
      socialTwitter, socialYoutube,
      socialLinks
    } = req.body;

    if (socialLinks) {
      try {
        const parsedLinks = JSON.parse(socialLinks);
        socialYahoo = parsedLinks.Yahoo || null;
        socialFacebook = parsedLinks.Facebook || null;
        socialInstagram = parsedLinks.Instagram || null;
        socialTwitter = parsedLinks.Twitter || null;
        socialYoutube = parsedLinks.YouTube || null;
      } catch (err) {
        console.error('Failed to parse socialLinks:', err.message);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const logoUrl = req.file ? req.file.filename : profile.logoUrl;


    await profile.update({
      logoUrl,
      companyName,
      emailId,
      password: hashedPassword,
      website,
      companyType,
      mobileNumber,
      whatsappNumber,
      address,
      state,
      city,
      nation,
      pincode,
      aboutCompany,
      socialYahoo,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      socialYoutube
    });

    const data = profile.toJSON();
    data.socialLinks = {
      Yahoo: data.socialYahoo || '',
      Facebook: data.socialFacebook || '',
      Instagram: data.socialInstagram || '',
      Twitter: data.socialTwitter || '',
      YouTube: data.socialYoutube || '',
    };

    res.json({ message: 'Profile updated successfully', profile: data });
  } catch (error) {
    console.error('Error in updateCompanyProfile:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

const deleteCompanyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    await profile.destroy();
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error });
  }
};

module.exports = {
  createCompanyProfile,
  getAllCompanyProfiles,
  getCompanyProfileById,
  updateCompanyProfile,
  deleteCompanyProfile,
};
