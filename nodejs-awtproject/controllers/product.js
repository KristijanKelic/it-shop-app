const Product = require('../models/product.js');

exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  const productQuery = Product.find();
  let fetchedProducts;
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .then(products => {
      fetchedProducts = products;
      return Product.estimatedDocumentCount();
    })
    .then(count => {
      res.status(200).json({
        message: 'Products fetched successfully!',
        products: fetchedProducts,
        productCount: count
      });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Fetching products failed!'
      });
    });
};

exports.postProduct = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Product({
    title: req.body.title,
    content: req.body.content,
    image: url + '/images/' + req.file.filename,
    category: req.body.category,
    creator: req.userData.userId,
    price: req.body.price
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post added successfully!',
        product: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if(product) {
        res.status(200).json({
          message: 'Post fetched successfully!', product: product
        })
      } else {
        res.status(404).json({message: 'Post not found!'})
      }
    }).catch(err => {
      res.status(500).json({
        message: 'Fetching post failed!'
      })
    })
}