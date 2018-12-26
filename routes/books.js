const express= require('express');
const router = express.Router();
const {Book,validate}= require('../models/Book');
const auth = require('../middleware/auth');


router.get('/',async(req,res)=>{
  
  const book= await Book.find()
  res.send(book)
 
});


router.get('/:id',async(req,res)=>{
  
  const book = await  Book.findById(req.params.id)
  res.send(book)

});
router.post('/add',auth,async(req,res)=>{

  const {error}= validate(req.body);
  if(error)return res.status(400).send(error.details[0].message);

  const bookDetail={
    name:req.body.name,
    author:req.body.author,
    ISBN:req.body.ISBN,
    price:req.body.price,
    user:req.user._id
  }

 const book= new Book(bookDetail)

 await book.save();
 res.send(book);
   

});


router.put('/edit/:id',auth,async(req,res)=>{
  
  const book = await Book.findById(req.params.id).populate('user','-password')
  
  if(!book) return res.status(404).send('Not Found In the List');

  if(req.user._id !=book.user._id){
    return res.status(400).send('Not authorized')
  }

  const {error}= validate(req.body);
  if(error) return res.status(404).send(error.details[0].message);


  
      book.name=req.body.name;
      book.author=req.body.author;
      book.ISBN=req.body.ISBN;
      book.rate=req.body.rate;
    
   const result = await book.save();
   res.send(result)

})

router.delete('/delete/:id',auth,async(req,res)=>{

  const book = await Book.findById(req.params.id)
  
  if(req.user._id !=book.user._id){
    return res.status(400).send('Not authorized')
  }

  const result = await Book.deleteOne(req.params.id);
	
	res.send(result);
        
});



module.exports= router;