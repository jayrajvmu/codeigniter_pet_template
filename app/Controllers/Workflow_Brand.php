<?php

namespace App\Controllers;
use CodeIgniter\Files\File;

use App\Models\BrandModel;

class Workflow_Brand extends BaseController
{

    protected $db;

    protected $model;

    public function __construct()
    {
        $this->db = db_connect();
        $this->model = new BrandModel;
    }

    public function getBrand(){

        $data = $this->model->where('flag', 1)->findAll();
        if($data){
            echo $this->response_message([
                'code' => 200,
                'data' => json_encode($data)
            ]); return;
        }

        echo $this->response_message(false);
    }


    // public function getSpecificBrand(){

    //     $request = \Config\Services::request();
    //     $data =  $request->getPost();

    //     $response = $this->model->where('product_category_id', $data['product_category_id'])->first();
    //     echo json_encode($response);
    // }



    public function insertBrand(){

        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';
        $brand_check = $this->model->where(array('brand_name' => $data['brand_name'] , 'flag' => 1))->find();


        if(!$brand_check){
    
        if($_FILES['brand_logo']['name'] != ''){
            $img = $this->request->getFile('brand_logo');
           
            if (!$img->hasMoved()) {
                $newName = $img->getRandomName(); // Generate a random file name
                $img->move('uploads/brand', $newName); // Move the file to the uploads directory
                $data['brand_logo']= 'uploads/brand/'.$newName;       
            }
        }
        if($data && $this->model->insert($data, false)){
            echo $this->response_message([
                'code' => 200,
                'msg' => "Brand inserted successfully!"
            ]); return;
        }
        echo $this->response_message(false);
    }

        else{
            echo $this->response_message([
                'code' => 400,
                'msg' => "Brand name is already there try another name!"
            ]); return;
        }
    
    }
    
    public function updateBrand(){

        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';        
        $brand_id = $data['brand_id'];


        $brand_name_check = $this->model->where(array('brand_id !=' => $brand_id, 'brand_name' => $data['brand_name'] , 'flag' => 1))->first();


        if(!$brand_name_check){

        $brand_check = $this->model->where('brand_id', $brand_id)->first();
         if($brand_check){
            if($_FILES['brand_logo']['name'] != ''){
                $old_img=$brand_check['brand_logo'];
                $img = $this->request->getFile('brand_logo');
                if (!$img->hasMoved()) {
                    $newName = $img->getRandomName(); // Generate a random file name
                    $img->move('uploads/brand', $newName); // Move the file to the uploads directory
                    $data['brand_logo']= 'uploads/brand/'.$newName; 
                    
                    if (file_exists($old_img)) {
                        unlink($old_img); // This will delete the file from the server
                    }
                }
                }

            $update = $this->model->save($data);

            if($data && $update){
                if($this->model->db->affectedRows()){
                    echo $this->response_message([
                        'code' => 200,
                        'msg' => "Brand updated successfully!"
                    ]); return;
                } else{
                    echo $this->response_message([
                        'code' => 400,
                        'msg' => "No changes"
                    ]); return;
                }
            }
        }
        echo $this->response_message(false);

    }else{
        echo $this->response_message([
            'code' => 400,
            'msg' => "Brand name is already there try another name!"
        ]); return;
    }
    }

    public function deleteBrand(){

        $request = \Config\Services::request();
        $data =  [
            'brand_id' => $request->getPost('brand_id'),
            'flag' => 0
        ];

        $delete_image =   $request->getPost('brand_logo');
        $delete = $this->model->save($data);

        if($delete){

            if($this->model->db->affectedRows()){

                if (file_exists($delete_image)) {
                    unlink($delete_image); // This will delete the file from the server
                }
                echo $this->response_message([
                    'code' => 200,
                    'msg' => "Pet deleted successfully!"
                ]); return;
            }
        }
        echo $this->response_message(false);
    }
}