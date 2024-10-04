$(document).ready(function () {
  var mode, JSON, res_DATA, dist_id;

  getDistDetails();

  $.when(getDistDetails()).done(function () {
    dispDistDetails(JSON);
  });

  function refreshDetails() {
    $.when(getDistDetails()).done(function (brandDetails) {
      var table = $("#datatable").DataTable();
      table.clear();
      table.rows.add(brandDetails);
      table.draw();
      window.location.reload();
    });
  }

  $("#addUserData").click(function () {
    mode = "new";
    $("#distric_modal").modal("show");
  });

  // *************************** [Validation] ********************************************************************

  $("#btn-submit").click(function () {
    if ($("#dist_id").val() == "") {
      $.toast({
        icon: "error",
        heading: "Error",
        text: "Please Select State ",
        position: "top-right",
        bgColor: "#red",
        loader: true,
        hideAfter: 2000,
        stack: false,
        showHideTransition: "fade",
      });
    } else if ($("#dist_name").val() == "") {
      $.toast({
        icon: "error",
        heading: "Error",
        text: "Please Enter District ",
        position: "top-right",
        bgColor: "#red",
        loader: true,
        hideAfter: 2000,
        stack: false,
        showHideTransition: "fade",
      });
    } else {
      insertData();
    }
  });

  //*************************** [Insert] **************************************************************************

  function insertData() {
    var form = $("#modal-form")[0];
    data = new FormData(form);

    var url;
    if (mode == "new") {
      url = base_url + "insert-district";
    } else if (mode == "edit") {
      url = base_url + "update-district";
      data.append("dist_id", dist_id);
    }

    $.ajax({
      type: "POST",
      url: url,
      data: data,
      processData: false,
      contentType: false,
      cache: false,

      success: function (data) {
        var convertData = $.parseJSON(data);
        console.log(convertData);
        if (convertData.code == 200) {
          Swal.fire({
            title: "Congratulations!",
            text: convertData["msg"],
            icon: "success",
          });

          $("#distric_modal").modal("hide");

          refreshDetails();
        } else {
          Swal.fire({
            title: "Failure",
            text: convertData["msg"],
            icon: "danger",
          });

          $("#distric_modal").modal("hide");
          refreshDetails();
        }
      },
    });
  }

  // *************************** [get Data] *************************************************************************
  function getDistDetails() {
    $.ajax({
      type: "POST",
      url: base_url + "get-dist-list",
      dataType: "json",
      success: function (data) {
        res_DATA = data;
        dispDistDetails(res_DATA);
      },
      error: function () {
        console.log("Error");
      },
    });
  }
  // *************************** [Display Data] *************************************************************************

  function dispDistDetails(JSON) {
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
          mDataProp: "state_title",
        },
        {
          mDataProp: "dist_name",
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
    $("#distric_modal").modal("show");
    mode = "edit";

    var index = $(this).attr("id");
    var stateList = `<option value ="${res_DATA[index].state_id}">${res_DATA[index].state_title}</option>`;
    $("#state_id").html(stateList);

    $("#dist_name").val(res_DATA[index].dist_name);

    dist_id = res_DATA[index].dist_id;
  });

  // *************************** [Delete Data] *************************************************************************
  $(document).on("click", ".BtnDelete", function () {
    mode = "delete";
    var index = $(this).attr("id");
    dist_id = res_DATA[index].dist_id;

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
          url: base_url + "delete-dist",
          data: { dist_id: dist_id },

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
