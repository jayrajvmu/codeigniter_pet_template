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

  //Filter  Submenu
  $("#r_menu_id").change(function () {
    let r_menu_id = $(this).val();
    if (mode == "new") {
      $.ajax({
        type: "POST",
        url: base_url + "get-rsubmenu",
        data: { r_menu_id: r_menu_id },
        success: function (data) {
          var res = $.parseJSON(data);

          var rsubMenu = "";

          for (let i = 0; i < res.length; i++) {
            rsubMenu += `
            <option value="${res[i]["r_sub_id"]}">${res[i]["r_sub_menu"]}</option>`;
          }
          $("#r_sub_id").html(rsubMenu);
        },
      });
    } else if (mode == "edit") {
      $.ajax({
        type: "POST",
        url: base_url + "get-rsubmenu",
        data: { r_menu_id: r_menu_id },
        success: function (data) {
          var res = $.parseJSON(data);

          var rsubMenu = "";

          rsubMenu += `<option value="${subID}">${subName}</option>`;
          for (let i = 0; i < res.length; i++) {
            rsubMenu += `<option value="${res[i]["r_sub_id"]}">${res[i]["r_sub_menu"]}</option>`;
          }

          $("#r_sub_id").html(rsubMenu);
        },
      });
    }
  });

  // *************************** [Validation] ********************************************************************

  $("#btn-submit").click(function () {
    $(".error").hide();
    if ($("#r_menu_id").val() === "" && mode == "new") {
      $(".r_menu_id").html("Please Select Menu*").show();
    } else if ($("#r_sub_id").val() === "" && mode == "new") {
      $(".r_sub_id").html("Please select SubMenu*").show();
    } else if ($("#product_name").val() === "" && mode == "new") {
      $(".product_name").html("Please Enter name*").show();
    } else if ($("#product_price").val() === "" && mode == "new") {
      $(".product_price").html("Please Enter Price*").show();
    } else if ($("#offer_price").val() === "" && mode == "new") {
      $(".offer_price").html("Please Enter Offe Price*").show();
    } else if ($("#offer_details").val() === "" && mode == "new") {
      $(".offer_details").html("Please Enter offer details*").show();
    } else if ($("#redirect_url").val() === "" && mode == "new") {
      $(".redirect_url").html("Please Enter url*").show();
    } else if ($("#arrival_status").val() === "" && mode == "new") {
      $(".arrival_status").html("Please Select the option*").show();
    } else if ($("#soldout_status").val() === "" && mode == "new") {
      $(".soldout_status").html("Please Select the option*").show();
    } else if ($("#product_img").val() === "" && mode == "new") {
      $(".product_img").html("Please Select Product Image*").show();
    }

    // Product Details
    else if ($("#img_1").val() === "" && mode == "new") {
      $(".img_1").html("Please Select  Image*").show();
    } else if ($("#img_2").val() === "" && mode == "new") {
      $(".img_2").html("Please Select  Image*").show();
    } else if ($("#img_3").val() === "" && mode == "new") {
      $(".img_3").html("Please Select  Image*").show();
    } else if ($("#img_4").val() === "" && mode == "new") {
      $(".img_4").html("Please Select  Image*").show();
    } else if ($("#prod_desc").val() === "" && mode == "new") {
      $(".prod_desc").html("Please Enter Product Description*").show();
    } else if ($("#features").val() === "" && mode == "new") {
      $(".features").html("Please Enter Features *").show();
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
      url = base_url + "insert-rproduct-list";
    } else if (mode == "edit") {
      url = base_url + "update-rproduct-list";
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
          setTimeout(function () {
            window.location.reload();
          }, 1000);
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
      url: base_url + "get-rproduct-list",
      dataType: "json",
      success: function (data) {
        res_DATA = data;
        console.log(res_DATA);
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
          mDataProp: "r_menu",
        },
        {
          mDataProp: "r_sub_menu",
        },
        {
          mDataProp: "product_name",
        },
        {
          mDataProp: "offer_price",
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
    let color = res_DATA[index].color_name;
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

  var subID;
  var subName;
  $(document).on("click", ".btnEdit", function () {
    $("#model-data").modal("show");
    mode = "edit";

    var index = $(this).attr("id");

    console.log(res_DATA[index]);

    var rmenuID = res_DATA[index].r_menu_id;
    subID = res_DATA[index].r_sub_id;
    subName = res_DATA[index].r_sub_menu;
    $("#r_menu_id").val(rmenuID).trigger("change");

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
          url: base_url + "delete-rproduct-list",
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
