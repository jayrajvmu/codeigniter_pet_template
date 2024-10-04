$(document).ready(function () {
  var mode, JSON, res_DATA, prod_id;

  getproductDetails();

  $.when(getproductDetails()).done(function () {
    dispproductDetails(JSON);
  });

  function refreshDetails() {
    $.when(getproductDetails()).done(function (brandDetails) {
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
  });

  // *************************** [Validation] ********************************************************************

  $("#btn-submit").click(function () {
    $(".error").hide();
    if ($("#brand_id").val() === "" && mode == "new") {
      $(".brand_id").html("Please Select Brand name*").show();
    } 
    else if ($("#brand_img").val() === "" && mode == "new") {
      $(".brand_img").html("Please select brand image*").show();
    } 
    else if ($("#modal_id").val() === "" && mode == "new") {
      $(".modal_id").html("Please select Modal*").show();
    } 
    else if ($("#sub_access_id").val() === "" && mode == "new") {
      $(".sub_access_id").html("Please select Aceessories*").show();
    }

    else if ($("#product_name").val() === "" && mode == "new") {
      $(".product_name").html("Please Enter Product name*").show();
    }

    else if ($("#product_price").val() === "" && mode == "new") {
      $(".product_price").html("Please Enter Product Price*").show();
    }

    else if ($("#sub_access_id").val() === "" && mode == "new") {
      $(".sub_access_id").html("Please select Accessories*").show();
    }
    
    else if ($("#offer_details").val() === "" && mode == "new") {
      $(".offer_details").html("Please Enter Offer Details*").show();
    }

    else if ($("#product_img").val() === "" && mode == "new") {
      $(".product_img").html("Please Select Product Image*").show();
    }

    else if ($("#prod_desc").val() === "" && mode == "new") {
      $(".prod_desc").html("Please Enter Product Description*").show();
    }

    else if ($("#features").val() === "" && mode == "new") {
      $(".features").html("Please Enter Features *").show();
    }
    else {
      insertData();
    }
  });

  //*************************** [Insert] **************************************************************************

  function insertData() {
    var form = $("#product-main")[0];
    data = new FormData(form);

    var url;
    if (mode == "new") {
      url = base_url + "insert-product-details";
    } else if (mode == "edit") {
      url = base_url + "update-brand-list";
      data.append("prod_id", prod_id);
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
  // *************************** [Prevent modal form closing ] ****************************************************
  $("#model-data").modal({
    backdrop:'static',
    keyboard: false
  })

  // *************************** [Display the image on Modal ] ****************************************************

  $(document).on("change",'#product_img', function () {
    dispImg(this, "product_image_url");
  });
 
  $(document).on("change",'#img_1',function(){
    dispImg(this, "img1_url");
  });
  $(document).on("change",'#img_2',function(){
    dispImg(this, "img2_url");
  });
  $(document).on("change",'#img_3',function(){
    dispImg(this, "img3_url");
  });
  $(document).on("change",'#img_4',function(){
    dispImg(this, "img4_url");
  })

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
  function getproductDetails() {
    $.ajax({
      type: "POST",
      url: base_url + "get-product-details",
      dataType: "json",
      success: function (data) {
        res_DATA = data;

        dispproductDetails(res_DATA);
      },
      error: function () {
        console.log("Error");
      },
    });
  }
  // *************************** [Display Data] *************************************************************************

  function dispproductDetails(JSON) {
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
    $("#brand_name").val(res_DATA[index].brand_name);

    $("#brand_image_url").attr("src", base_url + res_DATA[index].brand_img);
    $("#brand_image_url").addClass("active");
    $("#brand_image_url").css("display", "block");
    prod_id = res_DATA[index].prod_id;
  });

  // *************************** [Delete Data] *************************************************************************
  $(document).on("click", ".BtnDelete", function () {
    mode = "delete";
    var index = $(this).attr("id");
    prod_id = res_DATA[index].prod_id;

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
});
