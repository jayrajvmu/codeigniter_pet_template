$(document).ready(function () {
    var mode, JSON, res_DATA, r_menu_id	;
  
    getMenuList();
  
    $.when(getMenuList()).done(function () {
      dispMenuList(JSON);
    });
  
    function refreshDetails() {
      $.when(getMenuList()).done(function (brandDetails){
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
      if ($("#r_menu").val() === "" && mode == "new") {
        $(".r_menu").html("Please Enter Menu*").show();
      } else {
        insertData();
      }
    });
  
    //*************************** [Insert] **************************************************************************
  
    function insertData() {
      var form = $("#mainmenu-form")[0];
      data = new FormData(form);
  
      var url;
      if (mode == "new") {
        url = base_url + "insert-menu-list";
      } else if (mode == "edit") {
        url = base_url + "update-menu-list";
        data.append("r_menu_id", r_menu_id);
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
    function getMenuList() {
      $.ajax({
        type: "POST",
        url: base_url + "get-menu-list",
        dataType: "json",
        success: function (data) {
    
          res_DATA = data;
          dispMenuList(res_DATA);
        },
        error: function () {
          console.log("Error");
        },
      });
    }
    // *************************** [Display Data] *************************************************************************
  
    function dispMenuList(JSON) {
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
  
      $("#r_menu").val(res_DATA[index].r_menu);
    //    console.log(res_DATA[index].r_menu_id);
      r_menu_id	 = res_DATA[index].r_menu_id;
    });
  
    // *************************** [Delete Data] *************************************************************************
    $(document).on("click", ".BtnDelete", function () {
      mode = "delete";
      var index = $(this).attr("id");
      r_menu_id	 = res_DATA[index].r_menu_id	;
  
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
            url: base_url + "delete-menu-list",
            data: { r_menu_id	: r_menu_id	 },
  
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
  