var mode, masterData, JSON, prod_id, petData, breedData, typeData, categoryData, brandData;
const module = 'product';

$(document).ready(function () {

  refreshDetails();
  //===[ Prevent modal form closing ]===
  $("#popup-modal").modal({
    backdrop: "static",
    keyboard: false,
  });

});

$('#add_product').on('click',function () {
  mode = "new";
  $('#myLargeModalLabel').html('Edit Product Type');

  $('#product-form')[0].reset();
  // $('#product_img').html('');

  $('#brandselect').children().remove();
// brand dropdown box
  $('#brandselect').append('<option value="">Select Brand</option>');
  $.each(brandData, function (key, value) {
    $('#brandselect')
      .append($('<option>', { value: value.brand_id })
        .text(value.brand_name));
  });
  
  $('#petselect').children().remove();
  // pet dropdown box
  $('#petselect').append('<option value="">Select Pet</option>');
  $.each(petData, function (key, value) {
    $('#petselect')
      .append($('<option>', { value: value.pet_id })
        .text(value.pet_name));
  });


  $('#breedselect').children().remove();
  // breed dropdown box
  $('#breedselect').append('<option value="">Select Breed</option>');
  $.each(breedData, function (key, value) {
    $('#breedselect')
      .append($('<option>', { value: value.breed_id })
        .text(value.breed_name));
  });


  $('#producttypeselect').children().remove();
  // product type dropdown box
  $('#producttypeselect').append('<option value="">Select Product Type</option>');
  $.each(typeData, function (key, value) {
    $('#producttypeselect')
      .append($('<option>', { value: value.product_type_id })
        .text(value.type));
  });


  $('#productcategoryselect').children().remove();
  // product category dropdown box
  $('#productcategoryselect').append('<option value="">Select Product Category</option>');
  $.each(categoryData, function (key, value) {
    $('#productcategoryselect')
      .append($('<option>', { value: value.product_category_id })
        .text(value.category));
  });


  $("#popup-modal").modal("show");
});

$("#btn-submit").on('click', function () {
  $(".error").hide();
  let formObject = [
    {
      value: $("#brandselect").val(),
      error: "Please entrer the brand name"
    },
    {
      value: $("#petselect").val(),
      error: "Please entrer the pet name"
    },
    {
      value: $("#breedselect").val(),
      error: "Please entrer the breed name"
    },
    {
      value: $("#producttypeselect").val(),
      error: "Please enter the product type"
    },
    {
      value: $("#productcategoryselect").val(),
      error: "Please enter the product category"
    },
    {
      value: $("#name").val(),
      error: "Please enter the product name"
    },
    {
      value: $("#summery").val(),
      error: "Please enter the summary"
    },
    {
      value: $("#description").val(),
      error: "Please enter the description"
    }
  ]
  
  if (FORM_VALIDATION(formObject)) {
    if (mode == "new") {
      insertProductData();
      }
    if (mode == "edit") {
      updateProductData();
    }
  }



});

//====[ Edit Product Data ]===
$(document).on("click", ".btnEdit", function () {
  mode = 'edit';
  $('#myLargeModalLabel').html('Edit Product Type');
  let index = $(this).attr("id");
  $('#brandselect').children().remove();

  
// brand dropdown box
$('#brandselect').append($('<option>', { value: masterData[index].brand_id }).text(masterData[index].brand_name));

  $('#brandselect').append('<option value="">Select Brand</option>');
  $.each(brandData, function (key, value) {
    $('#brandselect')
      .append($('<option>', { value: value.brand_id })
        .text(value.brand_name));
  });
  
  $('#petselect').children().remove();
  $('#petselect').append($('<option>', { value: masterData[index].pet_id }).text(masterData[index].pet_name));

  // pet dropdown box
  $('#petselect').append('<option value="">Select Pet</option>');
  $.each(petData, function (key, value) {
    $('#petselect')
      .append($('<option>', { value: value.pet_id })
        .text(value.pet_name));
  });


  $('#breedselect').children().remove();
  $('#breedselect').append($('<option>', { value: masterData[index].breed_id }).text(masterData[index].breed_name));

  // breed dropdown box
  $('#breedselect').append('<option value="">Select Breed</option>');
  $.each(breedData, function (key, value) {
    $('#breedselect')
      .append($('<option>', { value: value.breed_id })
        .text(value.breed_name));
  });


  $('#producttypeselect').children().remove();
  $('#producttypeselect').append($('<option>', { value: masterData[index].product_type_id }).text(masterData[index].type));

  // product type dropdown box
  $('#producttypeselect').append('<option value="">Select Product Type</option>');
  $.each(typeData, function (key, value) {
    $('#producttypeselect')
      .append($('<option>', { value: value.product_type_id })
        .text(value.type));
  });

  $('#productcategoryselect').children().remove();
  $('#productcategoryselect').append($('<option>', { value: masterData[index].product_category_id }).text(masterData[index].category));

  // product category dropdown box
  $('#productcategoryselect').append('<option value="">Select Product Category</option>');
  $.each(categoryData, function (key, value) {
    $('#productcategoryselect')
      .append($('<option>', { value: value.product_category_id })
        .text(value.category));
  });
  
  $("#name").val(masterData[index].name);
  $("#summery").val(masterData[index].summery);
  $("#description").val(masterData[index].description);

  if(masterData[index].instruction){
    $("#instruction").val(masterData[index].instruction);
  }
  $("#popup-modal").modal("show");
});

function getFormData(){
  return new FormData($("#product-form")[0]);
}

function refreshDetails(){
  getproductDetails();
  getpetDetails();
  gettypeDetails();
  getcategoryDetails();
  getbrandDetails();
  getbreedDetails();
  $("#popup-modal").modal("hide");
}

function insertProductData() {

  let data = getFormData();
  POST({ module, data }).then((response) => {
    SWAL_HANDLER(response);
    refreshDetails();
  });

}

//===[ Update Product Data ]===
function updateProductData() {

  let data = getFormData();
  data.append("prod_id", prod_id);

  let response = POST({module, data});

  let resultData = $.parseJSON(response);

  if (resultData.code == 200) {
    Swal.fire({
      title: "Congratulations!",
      text: resultData.msg,
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Failure",
      text: resultData.msg,
      icon: "error",
    });
  }

  refreshDetails();
}

    
  
    // *************************** [Display the image on Modal ] ****************************************************
  
    // $(document).on("change", "#product_img", function () {
    //   dispImg(this, "product_image_url");
    // });
  
    // $(document).on("change", "#img_1", function () {
    //   dispImg(this, "img1_url");
    // });
    // $(document).on("change", "#img_2", function () {
    //   dispImg(this, "img2_url");
    // });
    // $(document).on("change", "#img_3", function () {
    //   dispImg(this, "img3_url");
    // });
    // $(document).on("change", "#img_4", function () {
    //   dispImg(this, "img4_url");
    // });
  
    function dispImg(input, id) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          $("#" + id).attr("src", e.target.result);
          $("#" + id).css("display", "block");
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    
    //====[ Get all product data ]===
    function getproductDetails() {
      GET({ module }).then((data) => {
        masterData = data;
        displayProductDetails(masterData);
      });
    }

    
function getpetDetails() {

  
  GET({ module: 'pet' }).then((data) => {
    petData = data;

  });

  
}

function gettypeDetails() {
  GET({ module: 'producttype' }).then((data) => {
    typeData = data;
  });
}
function getcategoryDetails() {
  GET({ module: 'productcategory' }).then((data) => {
    categoryData = data;
  });
}
function getbrandDetails() {
  GET({ module: 'brand' }).then((data) => {
    brandData = data;
  });
}
function getbreedDetails() {
  GET({ module: 'breed' }).then((data) => {
    breedData = data;
  });
}
    //===[ Display Product details]===
    function displayProductDetails(JSON) {
      var i = 1;
      $("#datatable").DataTable({
        responsive: true,
        destroy: true,
        aaSorting: [],
        aaData: JSON,
      
        aoColumns: [
          {
            mDataProp: null,
            render: function (data, type, row, meta) {
              return i++;
            },
          },
          {
            mDataProp: "name",
          },
          {
            mDataProp: "summery",
          },
          {
            mDataProp: "description",
          },
       
      
  
          {
            mDataProp: function (data, type, full, meta) {
              return (
                
                '<a id="' +
                meta.row +
                '" class="btn btnEdit text-info fs-14 lh-1"> <i class="ri-edit-line"></i></a>' +
                '<a id="' +
                meta.row +
                '" class="btn BtnDelete text-danger fs-14 lh-1"> <i class="ri-delete-bin-5-line"></i></a>'
              );
            },
          },
        ],
      });
    }
  
    // *************************** [Delete Data] *************************************************************************
    $(document).on("click", ".BtnDelete", function () {
      mode = "delete";
      var index = $(this).attr("id");
      prod_id = res_DATA[index].product_id;
  
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            type: "POST",
            url: base_url + "deleteproduct",
            data: { prod_id: prod_id },
  
            success: function (data) {
              var resData = $.parseJSON(data);
  
              if (resData.code == 200) {
                Swal.fire({
                  title: "Congratulations!",
                  text: resData["message"],
                  icon: "success",
                });
  
                $("#model-data").modal("hide");
                refreshDetails();
              } else {
                Swal.fire({
                  title: "Failure",
                  text: resData["message"],
                  icon: "error",
                });
  
                $("#model-data").modal("hide");
                refreshDetails();
              }
            },
          });
        }
      });
    });
  
    $(document).on('change','#navbar_title_id',function(){

      let id = $(this).val();

      $.ajax({
        type: "POST",
        url: base_url + "getsubmenu",
        data: {
          id: id
        },
        dataType: "json",
        success: function (data) {
          $('#navbar_page_id').html('<option value="">Select</option>' + data);
        },
        error: function () {
          console.log("Error");
        },
      });
    })

