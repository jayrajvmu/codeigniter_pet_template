var mode, masterData, petData = [], product_type_id;
const module = 'producttype';

$(document).ready(function () {

  refreshDetails();

  //===[ Prevent modal form closing ]===
  $("#popup-modal").modal({
    backdrop: "static",
    keyboard: false,
  });

});

$('#add_product_type').on('click', function () {
  mode = 'new';
  cleanPoup();

  $('#producttypeselect').children().remove();
  $('#producttypeselect').append('<option value="">Select a pet</option>');
  $.each(petData, function (key, value) {
    $('#producttypeselect')

      .append($('<option>', { value: value.pet_id })
        .text(value.pet_name));

  });

  $('#productTypeModelTitle').html('Add Product Type');
  $("#popup-modal").modal("show");
});


$("#btn-submit").on('click', function () {
  $(".error").hide();
  let formObject = [
    {
      value: $("#producttypeselect").val(),
      error: "Please select the pet name"
    },
    {
      value: $("#product_name").val(),
      error: "Please entrer the Product Name"
    }
  ]
  if (FORM_VALIDATION(formObject)) {
    if (mode == "new") {
        insertProductTypeData();
      }
    if (mode == "edit") {
        updateProductTypeData();
    }
  }

});



//====[ Edit Product Data ]===
$(document).on("click", ".btnEdit", function () {

  mode = 'edit';
  let index = $(this).attr("id");
  product_type_id = masterData[index]['product_type_id'];

  
  cleanPoup();


  $('#productTypeModelTitle').html('Edit Product Type');
  
  $('#producttypeselect').children().remove();
  $('#producttypeselect').append($('<option>', { value: masterData[index].pet_id }).text(masterData[index].pet_name));
  $.each(petData, function (key, value) {
    $('#producttypeselect')
      .append($('<option>', { value: value.pet_id }).text(value.pet_name));
  });

  $("#product_name").val(masterData[index].type);

  $("#popup-modal").modal("show");
});

//===[ Insert Product Data ]===
function insertProductTypeData() {

  let data = getFormData();



  POST({ module, data }).then((response) => {
    SWAL_HANDLER(response);

    refreshDetails();
  });

}
//===[ Update Product Data ]===
function updateProductTypeData() {

  let data = getFormData();

  
  data.append("product_type_id", product_type_id);

  PUT({ module, data }).then((response) => {
    SWAL_HANDLER(response);

    refreshDetails();
  });
}

//====[ Get all product data ]===
function getproductTypeDetails() {
  GET({ module }).then((data) => {
    masterData = data;
    displayProductTypeDetails(masterData);
  });
}


function getpetDetails() {
  GET({ module: 'pet' }).then((data) => {
    petData = data;
  });
}

//===[ Display Product details]===
function displayProductTypeDetails(tableData) {




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
          mDataProp: "type",
        },
        {
          mDataProp: "pet_name",
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

//===[Delete Data]===
$(document).on("click", ".BtnDelete", function () {

  let index = $(this).attr("id");
  mode = "delete";
  product_type_id = masterData[index]['product_type_id'];

  

  Swal.fire({
    title: "Alert!",
    text: `You want to delete the ${masterData[index].type}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {

      DELETE({ module, data: { product_type_id } }).then((response) => {
        SWAL_HANDLER(response);

        refreshDetails();
      });
    }
  });
});

$(document).on('change', '#navbar_title_id', function () {

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

function getFormData() {
  return new FormData($("#product-type-form")[0]);
}

function cleanPoup() {
  $('#product-type-form')[0].reset();
  $('#product_image_url').hide();
}

function refreshDetails() {
  getproductTypeDetails();
  getpetDetails();
  $("#popup-modal").modal("hide");
}