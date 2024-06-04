import Card from "../models/card.model.js";

const getAll = async (req, res) => {
  try {
    const cards = await Card.find();
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// get all card in one course
const getCardsInCourse = async(req, res) => {
  try {
    const {courseId} = req.params;
    const cards = await Card.find({courseId});
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({message: error});
  }
}

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    return res.status(200).json(card);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const create = async (req, res) => {
  try {
    const newCard = await new Card(req.body);
    const card = await newCard.save();
    return res.status(201).json(card);
  } catch (error) {
    return res.status(500).json({message: error});
  }
};

const update = async (req, res) => {
  const {id} = req.params;
  try {
    const updateCard = await Card.findByIdAndUpdate(id, req.body);

    if(!updateCard) return res.status(404).json({message: "Card not found"});

    return res.status(200).json({message: "Update successfully!"});
  } catch (error) {
    return res.status(500).json({message: error});
  }
};

const  deleteCard = async (req, res) => {
  const {id} = req.params;

  try {
    const card = await Card.findByIdAndDelete(id);

    if(!card) return res.status(404).json({message: "Card not found"});

    return res.status(200).json({message: "Delete successfully!"});
  } catch (error) {
    return res.status(500).json({message: error});
  }
};

export default {
  getAll,
  getCardsInCourse,
  getOne,
  create,
  update,
  deleteCard,
}