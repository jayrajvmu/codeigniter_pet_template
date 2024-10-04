<!DOCTYPE html>

<!-- TITLE -->
<title>Product</title>
<html lang="en" dir="ltr" data-nav-layout="vertical" data-theme-mode="light" data-header-styles="light" data-menu-styles="dark" data-toggled="close">

<?php require ('components/head.php') ?>

<body>

    <!-- PAGE -->
    <div class="page">
        <?php require ('components/topnav.php') ?>

        <?php require ('components/sidenavbar.php') ?>

        <!-- MAIN-CONTENT -->
        <div class="main-content app-content">
            <div class="container-fluid">

                <!-- Page Header -->
                <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                    <h1 class="page-title fw-semibold fs-18 mb-0">ProductList</h1>
                    <div class="ms-md-1 ms-0">
                        <nav>
                            <ol class="breadcrumb mb-0">
                                <li class="breadcrumb-item"><a href="#">Product</a></li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <!-- Page Header Close -->


                <div class="row">
                    <div class="col-xl-12">
                        <div class="card custom-card">
                            <div class="card-header">
                                <a 
                                    id="add_product"
                                    class="btn btn-end btn-outline-primary btn-wave d-sm-flex align-items-center justify-content-between"
                                >
                                    Add Products
                                </a>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="datatable" class="table table-bordered text-nowrap w-100">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Name</th>
                                                <th>Summery</th>
                                                <th>Description</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- data -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="popup-modal" tabindex="-1" role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog  modal-lg  modal-dialog-">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="myLargeModalLabel">Add Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="product-form">
                        <div class="container">
                            <div class="row">

                                

                            <div class="col-lg-12 mt-3">
                                <div class="form-floating">
                                <select class="form-select" id="brandselect" aria-label="Floating label select example" name="brand_id">
                                <option value="">Select Brand</option>

                                 
                                </select>
                                <label for="brandselect"><span class='text-danger'>*</span>Brand Name</label>
                                </div>
                  
                            </div>



                            <div class="col-lg-12 mt-3">
                                <div class="form-floating">
                                <select class="form-select" id="petselect" aria-label="Floating label select example" name="pet_id">
                                <option value="">Select Pet</option>

                                 
                                </select>
                                <label for="petselect"><span class='text-danger'>*</span>Pet Name</label>
                                </div>
                  
                            </div>


                            <div class="col-lg-12 mt-3">
                                <div class="form-floating">
                                <select class="form-select" id="breedselect" aria-label="Floating label select example" name="breed_id">
                                <option value="">Select Breed</option>

                                 
                                </select>
                                <label for="breedselect"><span class='text-danger'>*</span>Breed Name</label>
                                </div>
                  
                            </div>



                            <div class="col-lg-12 mt-3">
                                <div class="form-floating">
                                <select class="form-select" id="producttypeselect" aria-label="Floating label select example" name="product_type_id">
                                <option value="">Select Producttype</option>

                                 
                                </select>
                                <label for="producttypeselect"><span class='text-danger'>*</span>Product Type Name</label>
                                </div>
                  
                            </div>


                            <div class="col-lg-12 mt-3">
                                <div class="form-floating">
                                <select class="form-select" id="productcategoryselect" aria-label="Floating label select example" name="product_category_id">
                                <option value="">Select Product Category</option>

                                 
                                </select>
                                <label for="productcategoryselect"><span class='text-danger'>*</span>Product Category Name</label>
                                </div>
                  
                            </div>







                            <div class="col-lg-12 mt-3">
                                    <div class="form-floating mb-4 floating">
                                        <input
                                            class="form-control product_name" 
                                            id="name"
                                            placeholder="Enter the product name" 
                                            name="name"
                                        >
                                        <label for="product_name"><span class='text-danger'>*</span> ProductName</label>
                                        <span class="error text-danger mt-5 product_name"></span>
                                    </div>
                                </div>








                                <div class="col-lg-12 mt-3">
                                    <label for="summery" class="form-label"><span class='text-danger'>*</span> Summery</label>
                                    <textarea class="form-control" id="summery" name="summery" rows="3"></textarea>
                                    <span class="error text-danger mt-5 summery"></span>
                                </div>



                                
                                <div class="col-lg-12 mt-3">
                                    <label for="description" class="form-label"><span class='text-danger'>*</span> Description</label>
                                    <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                                    <span class="error text-danger mt-5 description"></span>
                                </div>

                                <div class="col-lg-12 mt-3">
                                    <label for="instruction" class="form-label">Instruction</label>
                                    <textarea class="form-control" id="instruction" name="instruction" rows="3"></textarea>
                                    <span class="error text-danger mt-5 instruction"></span>
                                </div>

                               

                            </div>
                </div> <br><br>
                <div class="mb-3 d-flex justify-content-end">

                    <a class="btn btn-success" id="btn-submit">Submit</a>

                </div>

                </hr>
                </form>

            </div>

        </div>
    </div>

    </div>



    <!-- View Details Modal -->

    <div class="modal fade bs-example-modal-lg" id="model-view" tabindex="-1" role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog  modal-lg  modal-dialog-">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="myLargeModalLabel">View Product Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="col-xl-12 ">
                        <div class="table-responsive">
                            <table class="table text-nowrap table-bordered border-success">
                                <thead>
                                    <tr>
                                        <th scope="col">Product Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td><span style="display: inline-block;" id="description"> </span></td>
                                </tbody>
                            </table>
                        </div>

                    </div>


                    <div class="table-responsive mt-3">
                        <table class="table text-nowrap table-bordered border-success">
                            <thead>
                                <tr>

                                    <th scope="col">Offer Details</th>
                                    <th scope="col">Offer Price</th>
                                    <th>New Arrivals Status</th>
                                    <th scope="col">Soldout Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span id="offer"> <span></td>
                                    <td><span id="offer-price"> <span></td>
                                    <td><span id="arrival-status"> <span></td>
                                    <td><span id="soldout-status"> <span></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <div class="table-responsive mt-5">
                        <table class="table text-nowrap table-bordered border-success " id="tbl-img">
                            <thead>
                                <tr>
                                    <th scope="col">Img1</th>
                                    <th scope="col">Img2</th>
                                    <th scope="col">Img3</th>
                                    <th scope="col">Img4</th>
                                </tr>
                            </thead>
                            <tbody>

                                <!--img Code  -->
                            </tbody>
                        </table>
                    </div>

                    <h5 class="modal-title mt-5" id="myLargeModalLabel">Specifications</h5>
                    <div class="table-responsive mt-3">
                        <table class="table text-nowrap table-bordered border-success" id="specific">
                            <thead>
                                <tr>
                                    <th scope="col">Specifications</th>
                                    <th scope="col">Details</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>

                        </table>
                    </div>

                    <h5 class="modal-title mt-5" id="myLargeModalLabel">Features</h5>
                    <div class="table-responsive mt-3">
                        <table class="table text-nowrap table-bordered border-success">
                            <thead>
                                <tr>

                                    <th scope="col">Features</th>

                                </tr>
                            </thead>
                            <tbody>
                                <td>
                                    <p style="text-align:justify;vertical-align: top;" id="product-feature"></p>
                                </td>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>


    </div>
    <?php require ('components/footer.php') ?>

    <script src="https://cdn.ckeditor.com/ckeditor5/45.0.0/classic/ckeditor.js"></script>

    <script src="<?= base_url() ?>assets/custom/js/product.js"></script>

</body>

</html>