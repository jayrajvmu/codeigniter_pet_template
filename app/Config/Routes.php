<?php

use CodeIgniter\Router\RouteCollection;
use App\Controllers\Workflow\LoginLogout;

$routes->get('/', 'BaseAction::index');
$routes->get('dashboard', 'BaseAction::dashboard');

# Product
$routes->get('product', 'BaseAction::product');

# Product Type
$routes->get('product_type', 'BaseAction::product_type');

# Product Category
$routes->get('product_category', 'BaseAction::product_category');

# Pet
$routes->get('pet', 'BaseAction::pet');

#Brand
$routes->get('brand', 'BaseAction::brand');


#Breed
$routes->get('breed', 'BaseAction::breed');

###########################[ API Routes ]##################################

# Login Logout
$routes->post('login-check', 'Workflow_LoginLogout::logincheck');
$routes->get('logout', 'Workflow_LoginLogout::logout');

# User
$routes->get('getusercount', 'Workflow_User::getUserCount');

# Pet
$routes->get('getpet', 'Workflow_Pet::getPet');
$routes->post('getspecificpet', 'Workflow_Pet::getSpecificPet');
$routes->post('insertpet', 'Workflow_Pet::insertPet');
$routes->post('updatepet', 'Workflow_Pet::updatePet');
$routes->post('deletepet', 'Workflow_Pet::deletePet');

# Product Type
$routes->get('getproducttype', 'Workflow_Product_Type::getProductType');
$routes->post('getspecificproducttype', 'Workflow_Product_Type::getspecificProductType');
$routes->post('insertproducttype', 'Workflow_Product_Type::insertProductType');
$routes->post('updateproducttype', 'Workflow_Product_Type::updateProductType');
$routes->post('deleteproducttype', 'Workflow_Product_Type::deleteProductType');

# Product Category
$routes->get('getproductcategory', 'Workflow_Product_Category::getProductCategory');
$routes->post('getspecificproductcategory', 'Workflow_Product_Category::getspecificProductCategory');
$routes->post('insertproductcategory', 'Workflow_Product_Category::insertProductCategory');
$routes->post('updateproductcategory', 'Workflow_Product_Category::updateProductCategory');
$routes->post('deleteproductcategory', 'Workflow_Product_Category::deleteProductCategory');

# Brand
$routes->get('getbrand', 'Workflow_Brand::getBrand');
// $routes->post('getspecificproductcategory', 'Workflow_Product_Category::getspecificProductCategory');
$routes->post('insertbrand', 'Workflow_Brand::insertBrand');
$routes->post('updatebrand', 'Workflow_Brand::updateBrand');
$routes->post('deletebrand', 'Workflow_Brand::deleteBrand');

# Brand
$routes->get('getbreed', 'Workflow_Breed::getBreed');
// $routes->post('getspecificproductcategory', 'Workflow_Product_Category::getspecificProductCategory');
$routes->post('insertbreed', 'Workflow_Breed::insertBreed');
$routes->post('updatebreed', 'Workflow_Breed::updateBreed');
$routes->post('deletebreed', 'Workflow_Breed::deleteBreed');


# Product
$routes->get('getproduct', 'Workflow_Product::getProduct');
// $routes->post('getspecificproductcategory', 'Workflow_Product_Category::getspecificProductCategory');
$routes->post('insertproduct', 'Workflow_Product::insertProduct');
$routes->post('updateproduct', 'Workflow_Product::updateProduct');
$routes->post('deleteproduct', 'Workflow_Product::deleteProduct');

//NAVBAR ROUTES
$routes->get('title', 'Navbar::title');
$routes->post('navbartitle', 'Navbar::getTitle');
$routes->post('navbartitleedit', 'Navbar::navbartitleedit');
$routes->post('inserttile', 'Navbar::inserttile');
$routes->post('deletetitle', 'Navbar::deletetitle');
$routes->get('pages', 'Navbar::pages');
$routes->post('get-pages', 'Navbar::getpages');
$routes->post('delete-page-list', 'Navbar::deletepagelist');
$routes->post('insertpages', 'Navbar::insertpages');
$routes->post('updatepages', 'Navbar::updatepages');
$routes->post('delete-page', 'Navbar::deletepage');

// PRODUCT CONTOLLER$routes->post('insert-product-list', 'Product::insert');
$routes->post('getproduct', 'Product::getproduct');
$routes->post('getsubmenu', 'Product::getsubmenu');
$routes->post('deleteproduct', 'Product::deleteproduct');
$routes->post('update-product-list', 'Product::updateproduct');























