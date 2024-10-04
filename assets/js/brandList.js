$(document).ready(function () {
  var mode, JSON, res_DATA, brand_id;

  getbrandDetails();

  $.when(getbrandDetails()).done(function () {
    dispbrandDetails(JSON);
  });

  function refreshDetails() {
    $.when(getbrandDetails()).done(function (brandDetails) {
      var table = $("#datatable").DataTable();
      table.clear();
      table.rows.add(brandDetails);
      table.draw();
      window.location.reload();
    });
  }

  $("#addData").click(function () {
    mode = "new";

    $("#brand_image_url").css("display", "none");
    $("#model-data").val("");
    $("#model-data").modal("show");
  });

  // *************************** [Validation] ********************************************************************

  $("#brand-submit").click(function () {
    $(".error").hide();
    if ($("#brand_name").val() === "" && mode == "new") {
      $(".brand_error").html("Please enter brand name*").show();
    } else if ($("#brand_img").val() === "" && mode == "new") {
      $(".brand_img").html("Please select brand image*").show();
    } else {
      insertData();
    }
  });

  //*************************** [Insert] **************************************************************************

  function insertData() {
    var form = $("#brand-form")[0];
    data = new FormData(form);

    var url;
    if (mode == "new") {
      url = base_url + "insert-brandList";
    } else if (mode == "edit") {
      url = base_url + "update-brand-list";
      data.append("brand_id", brand_id);
    }

    $.ajax({
      type: "POST",
      enctype: "multipart/form-data",
      url: url,
      data: data,
      processData: false,
      contentType: false,
      cache: false,

      success: function (data) {
        var resultData = $.parseJSON(data);

        if (resultData.code == 200) {
          Swal.fire({
            title: "Congratulations!",
            text: resultData["msg"],
            icon: "success",
          });

          $("#model-data").modal("hide");
          refreshDetails();
        } else {
          Swal.fire({
            title: "Failure",
            text: resultData["msg"],
            icon: "danger",
          });

          $("#model-data").modal("hide");
          refreshDetails();
        }
      },
    });
  }

  // *************************** [Display the image on Modal ] ****************************************************

  $("#brand_img").on("change", function () {
    dispImg(this, "brand_image_url");
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
  // *************************** [get Data] *************************************************************************
  function getbrandDetails() {
    $.ajax({
      type: "POST",
      url: base_url + "get-brandData",
      dataType: "json",
      success: function (data) {
        res_DATA = data;

        dispbrandDetails(res_DATA);
      },
      error: function () {
        console.log("Error");
      },
    });
  }
  // *************************** [Display Data] *************************************************************************

  function dispbrandDetails(JSON) {
    var i = 1;
    $("#datatable").DataTable({
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
          mDataProp: "brand_name",
        },
        {
          mDataProp: function (data, type, full, meta) {
            if (data.brand_img !== null)
              return (
                "<a href=" +
                base_url +
                +data.brand_img +
                "><img src=" +
                base_url +
                data.brand_img +
                " alt='not-image' width=100></a>"
              );
            else return "";
          },
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

  // *************************** [Edit Data] *************************************************************************

  $(document).on("click", ".btnEdit", function () {
    $("#model-data").modal("show");
    mode = "edit";

    var index = $(this).attr("id");
    console.log(index);
    $("#brand_name").val(res_DATA[index].brand_name);

    $("#brand_image_url").attr("src", base_url + res_DATA[index].brand_img);
    $("#brand_image_url").addClass("active");
    $("#brand_image_url").css("display", "block");
    brand_id = res_DATA[index].brand_id;
  });

  // *************************** [Delete Data] *************************************************************************
  $(document).on("click", ".BtnDelete", function () {
    mode = "delete";
    var index = $(this).attr("id");
    brand_id = res_DATA[index].brand_id;

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
          url: base_url + "delete-brand-list",
          data: { brand_id: brand_id },

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
});
