$(document).ready(function () {
  var mode, JSON, res_DATA, modal_id;

  getModalDetails();

  $.when(getModalDetails()).done(function () {
    dispmodalDetails(JSON);
  });

  function refreshDetails() {
    $.when(getModalDetails()).done(function (brandDetails) {
      var table = $("#datatable").DataTable();
      table.clear();
      table.rows.add(brandDetails);
      table.draw();
      window.location.reload();
    });
  }

  $("#addData").click(function () {
    mode = "new";
    $("#model-data").val("");
    $("#model-data").modal("show");
    $("#modal_image_url").css("display", "none");
  });

  // *************************** [Validation] ********************************************************************

  $("#btn-submit").click(function () {
    $(".error").hide();
    if ($("#brand_id").val() === "" && mode == "new") {
      $(".brand_name").html("Please select brand name*").show();
    } else if ($("#modal_name").val() === "" && mode == "new") {
      $(".modal_error").html("Please Enter Modal name*").show();
    } else if ($("#modal_img").val() === "" && mode == "new") {
      $(".modal_img").html("Please Select Image*").show();
    } else {
      insertData();
    }
  });

  // *************************** [Display the image on Modal ] ****************************************************

  $("#modal_img").on("change", function () {
    dispImg(this, "modal_image_url");
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

  //*************************** [Insert] **************************************************************************

  function insertData() {
    var form = $("#modal-form")[0];
    data = new FormData(form);

    var url;
    if (mode == "new") {
      url = base_url + "insert-modal-list";
    } else if (mode == "edit") {
      url = base_url + "update-modal-list";
      data.append("modal_id", modal_id);
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

  // *************************** [get Data] *************************************************************************
  function getModalDetails() {
    $.ajax({
      type: "POST",
      url: base_url + "get-modal-data",
      dataType: "json",
      success: function (data) {
        res_DATA = data;

        dispmodalDetails(res_DATA);
      },
      error: function () {
        console.log("Error");
      },
    });
  }
  // *************************** [Display Data] *************************************************************************

  function dispmodalDetails(JSON) {
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
          mDataProp: "modal_name",
        },
        {
          mDataProp: function (data, type, full, meta) {
            if (data.modal_img !== null)
              return (
                "<a href=" +
                base_url +
                +data.modal_img +
                "><img src=" +
                base_url +
                data.modal_img +
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

    $("#brand_id").val(res_DATA[index].brand_id);
    $("#modal_name").val(res_DATA[index].modal_name);

    $("#modal_image_url").attr("src", base_url + res_DATA[index].modal_img);
    $("#modal_image_url").addClass("active");
    $("#modal_image_url").css("display", "block");

    modal_id = res_DATA[index].modal_id;
  });

  // *************************** [Delete Data] *************************************************************************
  $(document).on("click", ".BtnDelete", function () {
    mode = "delete";
    var index = $(this).attr("id");
    modal_id = res_DATA[index].modal_id;

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
          url: base_url + "delete-modal-list",
          data: { modal_id: modal_id },

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
                icon: "danger",
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
