$(document).ready(function () {
    var mode, JSON, res_DATA, access_id;

  
    getTitle();
  
    $.when(getTitle()).done(function () {
      dispTitle(JSON);
    });
  

  
    $("#addData").click(function () {
      mode = "new";
      $("#model-data").val("");
      $("#model-data").modal("show");
    });
  
  
  
    // *************************** [get Data] *************************************************************************
    function getTitle() {
      $.ajax({
        type: "POST",
        url: base_url + "navbartitle",
        dataType: "json",
        success: function (data) {
          res_DATA = data;
  
          dispTitle(res_DATA);
        },
        error: function () {
          console.log("Error");
        },
      });
    }
    // *************************** [Display Data] *************************************************************************
  
    function dispTitle(JSON) {
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
            mDataProp: "navbar_title",
          },
  
          {
            mDataProp: function (data, type, full, meta) {
                return `
                  <a id="${meta.row}" class="btn btnEdit text-info fs-14 lh-1" old="${data.navbar_title}" idd="${data.navbar_title_id}">
                    <i class="ri-edit-line"></i>
                  </a>` + 
                  `<a id="' + meta.row + '" idd="${data.navbar_title_id}" class="btn BtnDelete text-danger fs-14 lh-1"> <i class="ri-delete-bin-5-line"></i></a>`;
              }
              
          },
        ],
      });
    }
  
    // *************************** [Edit Data] *************************************************************************
  
    $(document).on("click", ".btnEdit", function () {
      var title = $(this).attr("old");
      $('#access_title').val(title);
      $("#model-data").modal("show");
      mode = "edit";
  
      var id = $(this).attr("idd");
      

      $('#btn-submit').attr('id',id)

      
  
  
    });

    $('#btn-submit').click(function(){
       if($('#access_title').val() == ''){
        $.toast({
          icon: "warning",
          heading: "Warning",
          text: "Please fill all details",
          position: "top-left",
          bgColor: "#red",
          loader: true,
          hideAfter: 2000,
          stack: false,
          showHideTransition: "fade",
        });
       }else{
        let id = $(this).attr('id');
        let title = $('#access_title').val();
        console.log(mode);
        

        if(mode == 'edit'){
          updatetitle(id,title);
        }else{
          inserttile(title);
        }
       }
    })


    function inserttile(title){
      $.ajax({
        type: "POST",
        url: base_url + "inserttile",
        data: {
            title: title
        },
        cache: false,
        success:function(data){  
            JSON = $.parseJSON(data);    
            if(JSON.status=='Success')
            {
                location.reload();
            } else {
                location.reload();
            }	
        },      
        error: function() {
            console.log("Error"); 
            $("#loadder").hide(); 
        }
    });
    }



    function updatetitle(id,title){

        $.ajax({
            type: "POST",
            url: base_url + "navbartitleedit",
            data: {
                id: id,
                title: title
            },
            cache: false,
            success:function(data){  
                JSON = $.parseJSON(data);    
                if(JSON.status=='Success')
                {
                    location.reload();
                } else {
                    location.reload();
                }	
            },      
            error: function() {
                console.log("Error"); 
                $("#loadder").hide(); 
            }
        });
    }
  
  });


  $(document).on('click','.BtnDelete', function(){
    let id = $(this).attr('idd');
    mode = "delete";

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
                    url: base_url + "deletetitle",
                    data: { id: id },
                    success: function (data) {
                        var resData = $.parseJSON(data);

                        if (resData.code == 200) {
                            // Swal.fire({
                            //     title: "Congratulations!",
                            //     text: resData.message,
                            //     icon: "success",
                            // });
                            $location.reload();
                        } else {
                            // Swal.fire({
                            //     title: "Failure",
                            //     text: resData.message,
                            //     icon: "error", // Corrected from "danger" to "error"
                            // });

                            location.reload();
                        }
                    },
                    error: function () {
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred while processing your request.",
                            icon: "error",
                        });
                    }
                });
            }
        });
  })
  