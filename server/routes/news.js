const express = require("express");
const newsModel = require("../models/news");
const news = express();

news.post('/new', async(req,res)=>{
    const data = req.body;
    console.log(data)
    try {
        const resp = await newsModel.create(data);
        if (resp){
            return res.status(201).json({ message: "✅ News added successfully!"});
        }
        else{
            return res.status(500).json({message : "❌ Could not add news!"})
        }
    } catch (error) {
        return res.status(500).json({ message: "❌ An error occurred while adding news!" });
    }
})

news.get("/allnews", async (req, res) => {
  const resp = await newsModel.find({});
  if (resp.length > 0) {
    return res.status(200).json(resp);
  } else {
    return res.status(404).json({ message: "No News at the moment" });
  }
});


news.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const resp = await newsModel.findByIdAndUpdate(id, data, { new: true });
  if (resp){
    return res.status(200).json({message: '✅ News Updated Successfully!'})
  }
  else{
    return res.status(200).json({message: '❌ An error occurred while updating news!'})

  }
});

news.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const resp = await newsModel.findByIdAndDelete(id);
  if (resp){
    return res.status(200).json({message: '✅ News Deleted Successfully!'})
  }
  else{
    return res.status(200).json({message: '❌ An error occurred while deleting the news!'})

  }
});

module.exports = news;


