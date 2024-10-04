<?php

namespace App\Controllers;
use CodeIgniter\Files\File;

use App\Models\ProductTypeModel;

class Workflow_Product_Type extends BaseController
{
    protected $db;
    protected $model;

    public function __construct()
    {
        $this->db = db_connect();
        $this->model = new ProductTypeModel;
    }

    public function getProductType(){        
        $builder = $this->db->table('product_type_tbl');
                    $builder->select('*');
                    $builder->join('pet_tbl', 'pet_tbl.pet_id = product_type_tbl.pet_id');
                    $builder->where('product_type_tbl.flag=1');
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



    public function getSpecificProductType(){
        $request = \Config\Services::request();
        $data =  $request->getPost();
        $response = $this->model->where('product_type_id', $data['product_type_id'])->first();
        echo json_encode($response);
    }

    public function insertProductType(){
        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';

        // array('pet_id !=' => $pet_id, 'pet_name' => $data['pet_name'], 'flag' => 1 )
        $type_check = $this->model->where(array('pet_id' => $data['pet_id'], 'type' => $data['type'], 'flag' => 1 ))->first();

        if(!$type_check){


            if($data && $this->model->insert($data, false)){
                echo $this->response_message([
                    'code' => 200,
                    'msg' => "Product Type inserted successfully!"
                ]); return;
            }
            echo $this->response_message(false, false);
        }
        else{
            echo $this->response_message([
                'code' => 400,
                'msg' => "Product type name is already there try another name!"
            ]); return;
        }
    }
    
    public function updateProductType(){
        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';
        $updatedData=[];


        $pet_type_check = $this->model->where(array('product_type_id !=' => $data['product_type_id'], 'pet_id' => $data['pet_id'], 'type' => $data['type'], 'flag' => 1  ))->first();

        if(!$pet_type_check){
        $pet_check = $this->model->where('product_type_id', $data['product_type_id'])->first();
        if($pet_check){
            $updatedData['product_type_id']=$data['product_type_id'];
            $updatedData['pet_id']=$data['pet_id'];
            $updatedData['type']=$data['type'];
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
            'msg' => "Product type is already there try another name!"
        ]); return;
    }
    }




    public function deleteProductType(){

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