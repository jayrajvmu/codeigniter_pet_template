<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

use App\Models\ProductModel;

class Workflow_Product extends BaseController
{
    protected $db;
    protected $model;

    public function __construct()
    {
        $this->db = db_connect();
        $this->model = new ProductModel;
    }

    public function getProduct(){        
        $builder = $this->db->table('product_tbl');
                    $builder->select('*');
                    $builder->join('pet_tbl', 'pet_tbl.pet_id = product_tbl.pet_id');
                    $builder->join('product_type_tbl', 'product_type_tbl.product_type_id = product_tbl.product_type_id');
                    $builder->join('product_category_tbl', 'product_category_tbl.product_category_id = product_tbl.product_category_id');

                    $builder->join('brand_tbl', 'brand_tbl.brand_id = product_tbl.brand_id');

                    $builder->join('breed_tbl', 'breed_tbl.breed_id = product_tbl.breed_id');
                    $builder->where('product_tbl.flag=1');
                    $data = $builder->get();
                    $data =$data->getResult();

        if($data){
            echo $this->response_message([
                'code' => 200,
                'data' => json_encode($data)
            ]); return;
        }
        echo $this->response_message(false, false);
    }


    // public function getProductDropDown(){        
    //     $builder = $this->db->table('pet_tbl');
    //                 $builder->select('*');
    //                 $builder->join('product_type_tbl', 'product_type_tbl.product_type_id = product_tbl.product_type_id');
    //                 $builder->join('product_category_tbl', 'product_category_tbl.product_category_id = product_tbl.product_category_id');
    //                 $builder->where('product_tbl.flag=1');
    //                 $data = $builder->get();
    //                 $data =$data->getResult();
    //     if($data){
    //         echo $this->response_message([
    //             'code' => 200,
    //             'data' => json_encode($data)
    //         ]); return;
    //     }
    //     echo $this->response_message(false, false);
    // }


    public function insertProduct(){
        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';



        $product_check = $this->model->where(array( 'brand_id' => $data['brand_id'], 'breed_id' => $data['breed_id'], 'product_type_id' => $data['product_type_id'], 'product_category_id' => $data['product_category_id'], 'name' => $data['name'],  'flag' => 1 ))->first();
        if(!$product_check){

            if($data && $this->model->insert($data, false)){
                echo $this->response_message([
                    'code' => 200,
                    'msg' => "Product inserted successfully!"
                ]); return;
            }
            echo $this->response_message(false, false);
        }
        else{
            echo $this->response_message([
                'code' => 400,
                'msg' => "Product name is already there try another name!"
            ]); return;
        }
    }





    public function updateProduct(){

        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';
        $updatedData=[];



        $category_check = $this->model->where(array('product_category_id !=' => $data['product_category_id'], 'product_type_id' => $data['product_type_id'], 'category' => $data['category'], 'flag' => 1 ))->first();


        if(!$category_check){
        $pet_check = $this->model->where('product_category_id', $data['product_category_id'])->first();


        if($pet_check){
            $updatedData['product_category_id']=$data['product_category_id'];
            $updatedData['product_type_id']=$data['product_type_id'];
            $updatedData['category']=$data['category'];
            $update = $this->model->save($updatedData);
            if($data && $update){
                if($this->model->db->affectedRows()){
                    echo $this->response_message([
                        'code' => 200,
                        'msg' => "Pet updated successfully!"
                    ]); return;
                } else{
                    echo $this->response_message([
                        'code' => 400,
                        'msg' => "No changes"
                    ]); return;
                }
            }
            echo $this->response_message(false, false);
        }
        echo $this->response_message(false, false);

    }else{
        echo $this->response_message([
            'code' => 400,
            'msg' => "Product category name is already there try another name!"
        ]); return;
    }
    }

    
}