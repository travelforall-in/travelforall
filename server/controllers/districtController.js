import District from "../models/District.js";

export const district = async (req, res) => {
  try {
    const districts = await district.find().sort({ name: 1 }); // Sorted alphabetically
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const searchPlaces = async (req, res) => {
  try {
    const searchData = req.query.search_data || '';

    const query = {
      name: { $regex: searchData, $options: 'i' }
    };

    const response = await District.find(query);
 const returnData = response.map(i=>i.name)

    res.status(200).json({
      success: true,
      data: returnData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Something went wrong'
    });
  }
};
