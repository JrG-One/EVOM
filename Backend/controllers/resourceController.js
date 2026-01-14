const prisma = require("../lib/prisma");
const cloudinary = require("../lib/cloudinary");

// Fetch all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany();
    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching resources", error });
  }
};

// Add a new resource (Admin only)
exports.addResource = async (req, res) => {
  try {
    const { title, description, thumbnail, link } = req.body;
    if (!title || !description || !thumbnail || !link) {
      return res.status(400).json({ message: "all feilds are requires" });
    }
    const uploadResponse = await cloudinary.uploader.upload(thumbnail);

    const newResource = await prisma.resource.create({
      data: {
        title,
        description,
        thumbnail: uploadResponse.secure_url,
        link
      }
    });

    return res.status(201).json({ message: "Resource added successfully", newResource });
  } catch (error) {
    return res.status(500).json({ message: "Error adding resource", error });
  }
};

// Update a resource
exports.updateResource = async (req, res) => {
  const { title, description, link, thumbnail } = req.body;
  const { id } = req.params;

  try {
    let dataToUpdate = { title, description, link };

    if (thumbnail && thumbnail !== '') {
      const uploadResponse = await cloudinary.uploader.upload(thumbnail);
      dataToUpdate.thumbnail = uploadResponse.secure_url;
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: dataToUpdate
    });

    res.status(200).json({ message: "Resource updated", resource });
  } catch (error) {
    // Check for Prisma "Record not found" error code if precise handling needed, 
    // or just return 404/500 based on generic check
    res.status(500).json({ message: "Error updating resource", error: error.message });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.resource.delete({
      where: { id }
    });

    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resource", error: error.message });
  }
};
