$(document).ready(function () {
    var mode, res_DATA, modal_id;

    getModalDetails();

    $("#addData").click(function () {
        mode = "new";
        $("#modal-form")[0].reset(); // Reset form data
        $("#model-data").modal("show");
    });

    // *************************** [Validation] ********************************************************************

    $("#btn-submit").click(function () {
        $(".error").hide();
        if ($("#brand_id").val() === "" || $("#brand_id").val() === 'undefined') {
            if (mode == "new") {
                $(".brand_name").html("Please select title*").show();
            }
        } else if ($("#modal_name").val() === "" && mode == "new") {
            $(".modal_error").html("Please Enter Page name*").show();
        } else {
            insertData();
        }
    });
    

    // *************************** [Insert] **************************************************************************

    function insertData() {
        var form = $("#modal-form")[0];
        var data = new FormData(form);

        var url;
        if (mode == "new") {
            url = base_url + "insertpages";
        } else if (mode == "edit") {
            url = base_url + "updatepages";
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
                        text: resultData.msg,
                        icon: "success",
                    });

                    $("#model-data").modal("hide");

                    refreshDetails();
                } else {
                    Swal.fire({
                        title: "Failure",
                        text: resultData.msg,
                        icon: "error", // Corrected from "danger" to "error"
                    });

                    $("#model-data").modal("hide");
                    refreshDetails();
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

    // *************************** [Get Data] *************************************************************************
    function getModalDetails() {
        $.ajax({
            type: "POST",
            url: base_url + "get-pages",
            dataType: "json",
            success: function (data) {
                res_DATA = data; // No need to parse if dataType is "json"
                dispmodalDetails(res_DATA);
            },
            error: function () {
                console.log("Error");
            }
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
                    mDataProp: "navbar_title",
                },
                {
                    mDataProp: "navbar_page",
                },
                {
                    mDataProp: function (data, type, full, meta) {
                        // Use template literals to construct the HTML string
                        return `
                            <a id="${meta.row}" idd="${data.navbar_pages_id}"class="btn btnEdit text-info fs-14 lh-1">
                                <i class="ri-edit-line"></i>
                            </a>
                            <a id="${meta.row}" idd="${data.navbar_pages_id}" class="btn BtnDelete text-danger fs-14 lh-1">
                                <i class="ri-delete-bin-5-line"></i>
                            </a>
                        `;
                    }
                }
                
            ],
        });
    }

    // *************************** [Edit Data] *************************************************************************
    $(document).on("click", ".btnEdit", function () {
        $("#model-data").modal("show");
        mode = "edit";

        var index = $(this).attr("id");

       

        $("#brand_id").val(res_DATA[index].navbar_title_id);
        $("#modal_name").val(res_DATA[index].navbar_page);

        modal_id = res_DATA[index].navbar_pages_id;
    });

    // *************************** [Delete Data] *************************************************************************
    $(document).on("click", ".BtnDelete", function () {
        mode = "delete";
        var id = $(this).attr("idd");

        

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
                    url: base_url + "delete-page",
                    data: { id: id },
                    success: function (data) {
                        var resData = $.parseJSON(data);

                        if (resData.code == 200) {
                            Swal.fire({
                                title: "Congratulations!",
                                text: resData.message,
                                icon: "success",
                            });
                            $("#model-data").modal("hide");
                            getModalDetails()
                            
                        } else {
                            Swal.fire({
                                title: "Failure",
                                text: resData.message,
                                icon: "error", // Corrected from "danger" to "error"
                            });

                            $("#model-data").modal("hide");
                            getModalDetails()
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
    });

    // *************************** [Refresh Data] *************************************************************************
    function refreshDetails() {
        getModalDetails();
    }
});
