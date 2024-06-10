import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts
app.get('/posts', (req,res) => {
res.json(posts);
});



//CHALLENGE 2: GET a specific post by id
app.get('/posts/:id', (req,res)=>{
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  };
  const post = posts.find((post) => post.id === id);

  if (!post) {
    return res.status(404).json({ error: ' Post not found' });

  }
  res.json(post);
});



//CHALLENGE 3: POST a new post
app.post('/posts', (req,res) => {
  const id = parseInt(req.params.int);

  try {
    if (!req.body.title || !req.body.content || !req.body.author) {
      // If any of the required fields are missing, send a 400 Bad Request response
      return res.status(400).json({ error: "Missing required fields" });
    }

  const newPost = {
  id: posts.length + 1,
  title: req.body.title,
  content: req.body.content,
  author: req.body.author,
  date: new Date(),
  };

  posts.push(newPost);
  console.log(posts.slice(-1));
  res.json(newPost);

} catch (error) {
    // If any error occurs during the creation of the post, send a 500 Internal Server Error response
    console.error("Error creating post:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  };
});



//CHALLENGE 4: PATCH a post when you just want to update one parameter
// This code snippet update with patch but the changes made to the post are not persisted in a storage system. so i have to use
// another better codes which ensured the change made is persisted in storage system so the updated data 
// can show even when the server has been restarted (Use any of the two codes, the one up or the one commented)
app.patch('/posts/:id',(req,res)=>{
const id = parseInt(req.params.id);
const existingPost = posts.find((post)=> post.id === id);

if (!existingPost) {
  return res.status(404).json({ error: 'Post not found' });
}

const { title, content, author } = req.body; // Extract title, content, and author from req.body


if (!title && !content && !author) {
  return res.status(400).json({ error: 'At least one field (title, content, or author) must be provided' });
};

const updatedPost = {
  id:id,
  title:title || posts[existingPost].title,
  content:content || posts[existingPost].content,
  author: author || posts[existingPost].author,
  date: new Date(),
};
const searchIndex = posts.findIndex((post)=> post.id === id);
posts[searchIndex] = updatedPost;
res.json(updatedPost);
});


// Same codes with same function written in different ways for patch method
// app.patch('/posts/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const existingPostIndex = posts.findIndex(post => post.id === id);

//   if (existingPostIndex === -1) {
//       return res.status(404).json({ error: 'Post not found' });
//   }

//   const { title, content, author } = req.body;

//   if (!title && !content && !author) {
//       return res.status(400).json({ error: 'At least one field (title, content, or author) must be provided' });
//   }

//   const updatedPost = {
//       id: id,
//       title: title || posts[existingPostIndex].title,
//       content: content || posts[existingPostIndex].content,
//       author: author || posts[existingPostIndex].author,
//       date: new Date(),
//   };

//   // Update the post in the array
//   posts[existingPostIndex] = updatedPost;

//   // Respond with the updated post
//   res.json(updatedPost);
// });
// // Endpoint to get all posts
// app.get('/posts', (req, res) => {
//   res.json(posts);
// });


//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete('/posts/:id', (req,res)=> {
  const id = parseInt(req.params.id);
  const filteredPost = posts.filter((post)=> post.id !== id);

  // If the length of filteredpost is less than the lenght of the posts, it means a post was deleted
  if (filteredPost.length < posts.length) {
    posts = filteredPost; // Update the posts array
    res.status(204).send(); // No content to send, as the joke has been deleted
  } else {
    res.status(404).json({ error: "Post not found" });
  };
});


app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
