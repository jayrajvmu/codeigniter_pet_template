var mode, masterData, product_category_id, productType_Details;
const module = 'productcategory';

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

  $('#product-form')[0].reset();
  $('#product_img').html('');
  $('#productcategoryselect').children().remove();
  $('#productcategoryselect').append('<option value="">Select Product Type</option>');
  $.each(productType_Details, function (key, value) {
    $('#productcategoryselect')
      .append($('<option>', { value: value.product_type_id })
        .text(value.type));
  });

  $('#productCategoryModelTitle').html('Add Product Category');
  $("#popup-modal").modal("show");


});

$("#btn-submit").on('click', function () {   

  
  $(".error").hide();

  let formObject = [
    {
      value: $("#productcategoryselect").val(),
      error: "Please select product type"
    },{
      value: $("#product_category_name").val(),
      error: "Please enter the product category name"
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
  
  let index = $(this).attr("id");
  product_category_id = masterData[index]['product_category_id'];


  console.log(masterData[index]);
  

  $('#productCategoryModelTitle').html('Edit Product Type');
  
  $('#productcategoryselect').children().remove();
  $('#productcategoryselect').append($('<option>', { value: masterData[index].product_type_id }).text(masterData[index].type));
  $.each(productType_Details, function (key, value) {
    $('#productcategoryselect')
      .append($('<option>', { value: value.product_type_id }).text(value.type));
  });

  $("#product_category_name").val(masterData[index].category);

  $("#popup-modal").modal("show");
});



function getFormData(){
  return new FormData($("#product-form")[0]);
}

function refreshDetails(){
  getproductDetails();
  getpetDetaproductTypeDetails();

  $("#popup-modal").modal("hide");
}

function cleanPoup() {
  $('#product-type-form')[0].reset();
  $('#product_image_url').hide();
}

//===[ Insert Product Data ]===
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
  
  data.append("product_category_id", product_category_id);

  PUT({ module, data }).then((response) => {
    SWAL_HANDLER(response);

    refreshDetails();
  });
}

    
  
    // *************************** [Display the image on Modal ] ****************************************************
  
    $(document).on("change", "#product_img", function () {
      dispImg(this, "product_image_url");
    });
  
    $(document).on("change", "#img_1", function () {
      dispImg(this, "img1_url");
    });
    $(document).on("change", "#img_2", function () {
      dispImg(this, "img2_url");
    });
    $(document).on("change", "#img_3", function () {
      dispImg(this, "img3_url");
    });
    $(document).on("change", "#img_4", function () {
      dispImg(this, "img4_url");
    });
  
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
    


    //====[ Get All Pet Data ]===
function getproductDetails() {
  GET({ module }).then((data) => {
    masterData=(data);
    displayProductDetails(masterData);
  });
}



function getpetDetaproductTypeDetails() {
  GET({ module: 'producttype' }).then((data) => {
    productType_Details = data;    
  });
}



    function displayProductDetails(tableData) {
// console.log(tableData);


      //===[Destroy Data Table]===
      if ($.fn.DataTable.isDataTable('#datatable')) {
        $('#datatable').DataTable().destroy();
      }
    
      $('#datatable tbody').empty();
    
    
      if (typeof tableData === 'string') {
    
        $('#datatable').dataTable({
          "oLanguage": {
            "sEmptyTable": "My Custom Message On Empty Table"
          }
        });
    
      }
      else {
    
        $("#datatable").DataTable({
          destroy: true,
          aaSorting: [],
          aaData: tableData,
          aoColumns: [
            {
              mDataProp: null,
              render: function (data, type, row, meta) {
                return meta.row + 1;
              },
            },
            {
              mDataProp: "pet_name",
            },
            {
              mDataProp: "type",
            },
            {
              mDataProp: "category",
            },
        
            {
              mDataProp: function (data, type, full, meta) {
                return (
                  `<a id="${meta.row}" class="btn btnEdit text-info fs-14 lh-1"> <i class="ri-edit-line"></i></a>
                <a id="${meta.row}" class="btn BtnDelete text-danger fs-14 lh-1"> <i class="ri-delete-bin-5-line"></i></a>`
                );
              },
            },
          ],
        });
    
      }
    }
    
    // *************************** [Delete Data] *************************************************************************
    $(document).on("click", ".BtnDelete", function () {
      mode = "delete";
      var index = $(this).attr("id");
      product_category_id = masterData[index]['product_category_id'];
      
  
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
    
          DELETE({ module, data: { product_category_id } }).then((response) => {
            SWAL_HANDLER(response);
    
            refreshDetails();
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

