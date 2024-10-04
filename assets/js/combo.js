$(document).ready(function () {
  var mode, JSON, res_DATA, prod_id;

  getproductDetails();

  $.when(getproductDetails()).done(function () {
    dispproductDetails(JSON);
  });

  function refreshDetails() {
    $.when(getproductDetails()).done(function (e) {
      var table = $("#datatable").DataTable();
      table.clear();
      table.rows.add(e);
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

  function validateError(data) {
    $.toast({
      icon: "error",
      heading: "Warning",
      text: data,
      position: "bottom-left",
      bgColor: "#red",
      loader: true,
      hideAfter: 2000,
      stack: false,
      showHideTransition: "fade",
    });
  }

  $("#btn-submit").click(function () {
    $(".error").hide();
    if ($("#product_name").val() === "" && mode == "new") {
      validateError("Please Enter Product Name");
    } else if ($("#product_price").val() === "" && mode == "new") {
      validateError("Please Enter Price*");
    } else if ($("#offer_price").val() === "" && mode == "new") {
      validateError("Please Enter Offer Price*");
    } else if ($("#offer_details").val() === "" && mode == "new") {
      validateError("Please Enter offer details*");
    } else if ($("#redirect_url").val() === "" && mode == "new") {
      validateError("Please Enter url*");
    } else if ($("#arrival_status").val() === "" && mode == "new") {
      validateError("Please Select the Arrival Status*");
    } else if ($("#soldout_status").val() === "" && mode == "new") {
      validateError("Please Select Stock*");
    } else if ($("#product_img").val() === "" && mode == "new") {
      validateError("Please Select Product Image");
    }

    // Product Details
    else if ($("#img_1").val() === "" && mode == "new") {
      validateError("Please Select  Image*");
    } else if ($("#img_2").val() === "" && mode == "new") {
      validateError("Please Select  Image*");
    } else if ($("#img_3").val() === "" && mode == "new") {
      validateError("Please Select  Image*");
    } else if ($("#img_4").val() === "" && mode == "new") {
      validateError("Please Select  Image*");
    } else if ($("#prod_desc").val() === "" && mode == "new") {
      validateError("Please Enter Product Description*");
    } else if ($("#features").val() === "" && mode == "new") {
      validateError("Please Enter Features *");
    } else {
      insertData();
    }
  });

  //*************************** [Insert] **************************************************************************

  function insertData() {
    var form = $("#product-main")[0];
    data = new FormData(form);

    var url;
    if (mode == "new") {
      url = base_url + "insert-combo-products";
    } else if (mode == "edit") {
      url = base_url + "update-combo-products";
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
            icon: "error",
          });

          $("#model-data").modal("hide");
          refreshDetails();
        }
      },
    });
  }
  // *************************** [Prevent modal form closing ] ****************************************************
  $("#model-data").modal({
    backdrop: "static",
    keyboard: false,
  });

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
  // *************************** [get Data] *************************************************************************
  function getproductDetails() {
    $.ajax({
      type: "POST",
      url: base_url + "get-combo-products",
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
          mDataProp: "product_name",
        },
        {
          mDataProp: "product_price",
        },

        {
          mDataProp: function (data, type, full, meta) {
            if (data.product_img !== null && data.product_img !== "") {
              return (
                "<img src='" +
                base_url +
                data.product_img +
                "' alt='not-image' width='100'>"
              );
            } else {
              return "";
            }
          },
        },

        {
          mDataProp: function (data, type, full, meta) {
            return (
              '<a id="' +
              meta.row +
              '" class="btn btnView text-info fs-14 lh-1"> <i class="fe fe-eye"></i></a>' +
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
  // *************************** [View  Data] *************************************************************************
  $(document).on("click", ".btnView", function () {
    $("#model-view").modal("show");
    var index = $(this).attr("id");

    $("#description").html(res_DATA[index].prod_desc);
    $("#offer").html(res_DATA[index].offer_details);
    $("#offer-price").html(res_DATA[index].offer_price);

    let sold_sts = res_DATA[index].soldout_status;
    console.log(sold_sts);

    $("#soldout-status").html(
      `<span class="badge rounded-pill  ${
        sold_sts == 1 ? "bg-success" : "bg-danger"
      }">${sold_sts == 1 ? "Available" : "Out of Stock"}</span></a>`
    );

    let arrival_sts = res_DATA[index].arrival_status;
    $("#arrival-status").html(
      `<span class="badge rounded-pill ${
        arrival_sts == 1 ? "btn-success" : "btn-warning"
      }">${arrival_sts == 1 ? "New Arrival" : "current"}</span>`
    );
    //  display image
    let imgRow = "";
    let img1 = res_DATA[index].img_1;
    let img2 = res_DATA[index].img_2;
    let img3 = res_DATA[index].img_3;
    let img4 = res_DATA[index].img_4;

    imgRow += `<tr>
        <td><img width="130px" src="${base_url}${img1}" alt="Image 1"></td>
        <td><img  width="130px" src="${base_url}${img2}" alt="Image 2"></td>
        <td><img width="130px" src="${base_url}${img3}" alt="Image 3"></td>
        <td><img width="130px" src="${base_url}${img4}" alt="Image 4"></td>
                  </tr>`;
    $("#tbl-img tbody").html(imgRow);

    // Specification
    let tblSpecific = "";
    let material = res_DATA[index].material;
    let color = res_DATA[index].colour;
    let prod_weight = res_DATA[index].prod_weight;
    let measurement = res_DATA[index].measurement;
    let fitment = res_DATA[index].fitment;
    let warranty = res_DATA[index].warrenty;

    tblSpecific += `<tr>
                        <td>Material</td>
                        <td>${material}</td>
                     </tr>
                     <tr>
                        <td>Color</td>
                        <td>${color}</td>
                     </tr>
                     <tr>
                        <td>Product weight (kg)</td>
                        <td>${prod_weight}</td>
                     </tr>
                     <tr>
                        <td>Product measurement L*B*H (cm)</td>
                        <td>${measurement}</td>
                     </tr>
                     <tr>
                        <td>Fitment</td>
                        <td>${fitment}</td>
                     </tr>
                     <tr>
                        <td>Warranty</td>
                        <td>${warranty}</td>
                     </tr>`;

    $("#specific tbody").html(tblSpecific);

    $("#product-feature").html(res_DATA[index].features);
  });

  // *************************** [Edit Data] *************************************************************************

  $(document).on("click", ".btnEdit", function () {
    $("#model-data").modal("show");
    mode = "edit";

    var index = $(this).attr("id");
    $("#h_menu_id").val(res_DATA[index].h_menu_id);

    $subMenu = "";
    $subMenu += `<option value="${res_DATA[index].h_submenu_id}">${res_DATA[index].h_submenu}</option>`;
    $("#h_submenu_id").html($subMenu);

    $("#product_name").val(res_DATA[index].product_name);
    $("#redirect_url").val(res_DATA[index].redirect_url);
    $("#product_price").val(res_DATA[index].product_price);
    $("#offer_price").val(res_DATA[index].offer_price);
    $("#offer_details").val(res_DATA[index].offer_details);

    $("#arrival_status").val(res_DATA[index].arrival_status);

    $("#soldout_status").val(res_DATA[index].soldout_status);

    // product img
    $("#product_image_url").attr("src", base_url + res_DATA[index].product_img);
    $("#product_image_url").addClass("active");
    $("#product_image_url").css("display", "block");
    // images

    $("#img1_url").attr("src", base_url + res_DATA[index].img_1);
    $("#img1_url").addClass("active");
    $("#img1_url").css("display", "block");

    $("#img2_url").attr("src", base_url + res_DATA[index].img_2);
    $("#img2_url").addClass("active");
    $("#img2_url").css("display", "block");

    $("#img3_url").attr("src", base_url + res_DATA[index].img_3);
    $("#img3_url").addClass("active");
    $("#img3_url").css("display", "block");

    $("#img4_url").attr("src", base_url + res_DATA[index].img_4);
    $("#img4_url").addClass("active");
    $("#img4_url").css("display", "block");

    $("#prod_desc").val(res_DATA[index].prod_desc);

    // specification
    $("#material").val(res_DATA[index].material);

    var color = "";
    color += `<option value="${res_DATA[index].colour}?>${res_DATA[index].color_name}</option>`;
    $("#colour").val(res_DATA[index].colour);

    $("#prod_weight").val(res_DATA[index].prod_weight);
    $("#measurement").val(res_DATA[index].measurement);
    $("#fitment").val(res_DATA[index].fitment);
    $("#warrenty").val(res_DATA[index].warrenty);

    $("#features").val(res_DATA[index].features);

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
          url: base_url + "delete-combo-product",
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
