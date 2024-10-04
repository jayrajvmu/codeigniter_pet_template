<?php

namespace App\Controllers;
use CodeIgniter\Files\File;

use App\Models\ProductCategoryModel;

class Workflow_Product_Category extends BaseController
{

    protected $db;

    protected $model;

    public function __construct()
    {
        $this->db = db_connect();
        $this->model = new ProductCategoryModel;
    }

    public function getProductCategory(){
        $builder = $this->db->table('product_category_tbl');
        $builder->select('*');
        $builder->join('product_type_tbl', 'product_type_tbl.product_type_id = product_category_tbl.product_type_id');
        $builder->join('pet_tbl', 'pet_tbl.pet_id = product_type_tbl.pet_id');
        $builder->where('product_category_tbl.flag=1');
        $data = $builder->get();
        $data =$data->getResult(); 
        $last=  $this->db->getLastQuery();

        if($data){
            echo $this->response_message([
                'code' => 200,
                'data' => json_encode($data)
            ]);return;
        }
        echo $this->response_message(false);
    }


    public function getSpecificProductCategory(){

        $request = \Config\Services::request();
        $data =  $request->getPost();

        $response = $this->model->where('product_category_id', $data['product_category_id'])->first();
        echo json_encode($response);
    }

    public function insertProductCategory(){

        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';

        $category_check = $this->model->where(array('product_type_id' => $data['product_type_id'], 'category' => $data['category'], 'flag' => 1 ))->first();
        if(!$category_check){
        if($data && $this->model->insert($data, false)){
            echo $this->response_message([
                'code' => 200,
                'msg' => "Product Category inserted successfully!"
            ]); return;
        }
        echo $this->response_message(false, false);
    }
    else{
        echo $this->response_message([
            'code' => 400,
            'msg' => "Product category name is already there try another name!"
        ]); return;

    }
    }
    
    public function updateProductCategory(){

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

    public function deleteProductCategory(){

        $request = \Config\Services::request();
        $data =  $request->getPost();
        $data['flag']=0;

        if($data && $this->model->save($data)){
            echo $this->response_message([
                'code' => 200,
                'msg' => "Product Type deleted successfully!"
            ]); return;
        }
        echo $this->response_message(false, false);
    }
}