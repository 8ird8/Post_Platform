const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("./middlewares/multer");
const user = require("./models/user");
const post = require("./models/post");
const cookieParser = require("cookie-parser");
const authenticateToken = require("./middlewares/auth");
const fs = require("fs").promises;
const path = require("path");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["POSt", "GET", "DELETE", "PUT"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));

app.use(cookieParser());
app.use(express.json()); // this line for parse JSON requests

mongoose
  .connect(
    "mongodb+srv://achraf:achraf1234@cluster0.hvtfwte.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the database");
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
//

app.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    const data = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.file ? req.file.filename : "Default.png",
      password: hashedPassword,
      confirmPass: req.body.confirmPass,
      bio: "",
    };

    const checkEmail = await user.findOne({ email: req.body.email });
    if (!checkEmail) {
      if (req.body.password === req.body.confirmPass) {
        const newUser = await user.create(data);
        const token = jwt.sign(
          {
            userId: newUser._id,
            username: newUser.username,
            avatar: newUser.avatar,
            bio: newUser.bio,
          },
          "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd",
          { expiresIn: "7h" }
        );
        console.log("User registered successfully:", newUser);
        console.log("Token : ", token);
        res
          .status(200)
          .json({ success: true, message: "User registered successfully" });
        console.log("User created successfully:", newUser);
      } else {
        res
          .status(400)
          .json({ success: false, message: "Passwords do not match" });
      }
    } else {
      res.status(400).json({ success: false, message: "Email already in use" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//
app.post("/login", async (req, res) => {
  try {
    const data = await user.findOne({ email: req.body.email });

    if (data) {
      const passwordMatch = await bcryptjs.compare(
        req.body.password,
        data.password
      );

      if (passwordMatch) {
        const TOKEN_SECRET = "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd";
        const TOKEN_EXPIRY = "7h";
        const token = jwt.sign(
          {
            userId: data._id,
            username: data.username,
            avatar: data.avatar,
            email: data.email,
            bio: data.bio,
          },
          TOKEN_SECRET,
          { expiresIn: TOKEN_EXPIRY }
        );
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 3600000, // Example: 1 hour
        });
        res
          .status(200)
          .json({ success: true, message: "Login successful", token });
        console.log("User logged in successfully:", data);
        console.log("Token : ", token);
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: "Invalid Email Address" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "error server" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.status(200).json({ success: true, message: "Logout successful" });
});

app.get("/api/home", authenticateToken, (req, res) => {
  res.json({ success: true, isAuthenticated: true, user: req.user });
});

// Create post
app.post(
  "/add",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const decodedToken = jwt.verify(
        req.cookies.token,
        "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd"
      );

      const data = {
        title: req.body.title,
        description: req.body.description,
        image: req.file ? req.file.filename : "test.jpg",
        creator: decodedToken.userId,
      };

      const newPost = await post.create(data);
      console.log("Post Added successfully:", newPost);
      console.log(data);

      return res
        .status(200)
        .json({ success: true, message: "Post added successfully" });
    } catch (error) {
      console.error("Error adding post:", error);
      res.status(500).json({ success: false, message: "Error adding post" });
    }
  }
);
// fetching posts
app.get("/api/posts", authenticateToken, async (req, res) => {
  try {
    const posts = await post
      .find()
      .populate("creator", "avatar _id username")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
});

app.get("/api/posts/user/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await post
      .find({ creator: userId })
      .populate("creator", "avatar _id username")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
});

app.get("/posts/:postId", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const foundPost = await post
      .findById(postId)
      .populate("creator", "avatar _id");

    if (!foundPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post: foundPost });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, message: "Error fetching post" });
  }
});

//////////////////////////////// delete
app.delete("/posts/:postId", authenticateToken, async (req, res) => {
  const postId = req.params.postId;

  try {
    const postToDelete = await post.findById(postId);

    if (!postToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const filename = postToDelete?.image;

    if (filename) {
      fs.unlink(path.join(__dirname, "uploads", filename), (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }

    const decodedToken = jwt.verify(
      req.cookies.token,
      "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd"
    );
    const userId = decodedToken.userId;

    if (postToDelete.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own posts.",
      });
    }

    const deletedPost = await post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false, message: "Error deleting post" });
  }
});

////////////////////////////////

app.put("/update/:userId", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.params.userId;
    const User = await user.findById(userId);

    let updateData = {
      username: req.body.username ? req.body.username : User.username,
      email: req.body.email ? req.body.email : User.email,
      bio: req.body.bio ? req.body.bio : User.bio,
    };

    if (req.body.password) {
      const hashedPassword = await bcryptjs.hash(req.body.password, 10);
      updateData.password = hashedPassword;
    }

    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    const updateUser = await user.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (updateUser) {
      updateUser.password = undefined;

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updateUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/userId", (req, res) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(
      token,
      "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd"
    );
    currentUser = decoded.userId;
    avatar = decoded.avatar;
    username = decoded.username;
    email = decoded.email;
    bio = decoded.bio;
    res.status(200).json({
      success: true,
      message: " sucsses",
      userInfo: {
        userId: currentUser,
        avatar: avatar,
        username: username,
        email: email,
        bio: bio,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.get("/api/userInfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const currentUserInfo = await user.findById(id);

    if (!currentUserInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      return res.status(200).json({ success: true, currentUserInfo });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

// update post

app.put("/updatePost/:postId", upload.single("image"), async (req, res) => {
  try {
    const postId = req.params.postId;

    let updateData = {
      title: req.body.title,
      description: req.body.description,
    };
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatePost = await post.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    if (updatePost) {
      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post: updatePost,
      });
    } else {
      res.status(404).json({ success: false, message: "Post not found" });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Server Error");
  }
});

// like a post

app.post("/api/posts/:postId/like", authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  try {
    const postToLike = await post.findById(postId);

    if (!postToLike) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if the user has already liked the post
    const isLiked = postToLike.likes && postToLike.likes.includes(userId);

    if (isLiked) {
      const index = postToLike.likes.indexOf(userId);
      postToLike.likes.splice(index, 1);
      await postToLike.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Like removed",
          likes: postToLike.likes.length,
        });
    } else {
      postToLike.likes.push(userId);
      await postToLike.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Post liked",
          likes: postToLike.likes.length,
        });
    }
  } catch (error) {
    console.error("Error during liking  the post:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing your request" });
  }
});
