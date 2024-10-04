var mode, masterData = [], brand_id;
const module = 'brand';

$(document).ready(function () {
  refreshDetails();
  //===[ Prevent modal form closing ]===
  $("#popup-modal").modal({
    backdrop: "static",
    keyboard: false,
  });

});

$('#add_pet').on('click', function () {
  mode = 'new';
  cleanPoup();

  $('#brandModelTitle').html('Add Brand');
  $("#popup-modal").modal("show");
});



$("#btn-submit").on('click', function () {
  $(".error").hide();
  let formObjectNew = [
    {
      value: $("#brand_name").val(),
      error: "Please entrer the brand name"
    },
    {
      value: $("#brand_logo").val(),
      error: "Please upload the brand logo"
    }
  ]

  let formObjectUpdate = [
    {
      value: $("#brand_name").val(),
      error: "Please entrer the brand name"
    }
  ]

  if (mode == "new") {
    if (FORM_VALIDATION(formObjectNew)) {
      insertBrandData();
    }
  }

  if (mode == "edit") {
    if (FORM_VALIDATION(formObjectUpdate)) {
      updateBrandData();
    }
  }

});

//====[ Edit Pet Data ]===
$(document).on("click", ".btnEdit", function () {

  mode = 'edit';
  let index = $(this).attr("id");
  brand_id = masterData[index][module + '_id']
  cleanPoup();
  $('#brandModelTitle').html('Edit Brand');
  $("#brand_name").val(masterData[index].brand_name);

  if (masterData[index].brand_logo) {
    $("#brand_logo_url").attr('src', masterData[index].brand_logo);
    $("#brand_logo_url").show();
  }

  $("#popup-modal").modal("show");
});

//===[ Insert Pet Data ]===
function insertBrandData() {
  let data = getFormData();
  POST({ module, data }).then((response) => {
    SWAL_HANDLER(response);
    refreshDetails();
  });

}

//===[ Update Pet Data ]===
function updateBrandData() {
  let data = getFormData();
  data.append("brand_id", brand_id);
  PUT({ module, data }).then((response) => {
    SWAL_HANDLER(response);

    refreshDetails();
  });
}

//===[Display image on modal]===
$(document).on("change", "#brand_logo", function () {
  DISPLAY_IMAGE(this, "brand_logo_url");
});

//====[ Get All Pet Data ]===
function getbrandDetails() {
  GET({ module }).then((data) => {
    masterData = (data);

    displayBrandDetails(masterData);
  });
}

//===[ Display Pet details]===
function displayBrandDetails(tableData) {
  //===[Destroy Data Table]===
  if ($.fn.DataTable.isDataTable('#datatable')) {
    $('#datatable').DataTable().destroy();
  }

  $('#datatable tbody').empty();


  if (typeof tableData === 'string') {

    $('#datatable').dataTable({
      "oLanguage": {
        "sEmptyTable": "No data available"
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
          mDataProp: "brand_name",
        },
        {
          mDataProp: function (data, type, full, meta) {
            if (data.brand_logo && data.brand_logo !== "") {
              return (`<div class="text-center">
                <img src='${data.brand_logo}' alt='not-image' width='100'>
              </div>`);
            } else {
              return "<div class='d-flex align-items-center justify-content-center'>No Image</div>";
            }
          },
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
  brand_id = masterData[index][module + '_id'];
  brand_logo = masterData[index][module + '_logo'];

  

  Swal.fire({
    title: "Alert!",
    text: `You want to delete the ${masterData[index].brand_name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {

      DELETE({ module, data: { brand_id, brand_logo } }).then((response) => {
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
  return new FormData($("#brand-form")[0]);
}

function cleanPoup() {
  $('#brand-form')[0].reset();
  $('#brand_image_url').hide();
}

function refreshDetails() {
  getbrandDetails();
  $("#popup-modal").modal("hide");
}