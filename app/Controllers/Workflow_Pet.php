<?php

namespace App\Controllers;
use CodeIgniter\Files\File;

use App\Models\PetModel;

class Workflow_Pet extends BaseController
{

    public function __construct()
    {
        
    }

    public function getPet(){

        $petModel = new PetModel;
        $data = $petModel->where('flag', 1)->findAll();

        if($data){
            echo $this->response_message([
                'code' => 200,
                'data' => json_encode($data)
            ]); return;
        }

        echo $this->response_message(false);
    }

    public function getSpecificPet(){

        $petModel = new PetModel;
        $request = \Config\Services::request();
        $data =  $request->getPost();

        $response = $petModel->where('pet_id', $data['pet_id'])->first();
        
        if($response){
            echo $this->response_message([
                'code' => 200,
                'data' => json_encode($data)
            ]);
        }

        echo $this->response_message(false);
    }



    public function insertPet(){
        $petModel = new PetModel;
        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';


        $petCheck = $petModel->where(array('pet_name' => $data['pet_name'] , 'flag' => 1))->find();

        if(!$petCheck){
            if($_FILES['pet_img']['name'] != ''){
                $img = $this->request->getFile('pet_img');
                if (!$img->hasMoved()) {
                    $newName = $img->getRandomName(); // Generate a random file name
                    $img->move('uploads/pet', $newName); // Move the file to the uploads directory
                    $data['pet_img']= 'uploads/pet/'.$newName;          
                }
            }
            if($data && $petModel->insert($data, false)){
                echo $this->response_message([
                    'code' => 200,
                    'msg' => "Pet inserted successfully!"
                ]); return;
            }
            echo $this->response_message(false);

        }
        else{
            echo $this->response_message([
                'code' => 400,
                'msg' => "Pet name is already there try another name!"
            ]); return;
        }
    }
    

    public function updatePet(){

        $petModel = new PetModel;
        $request = \Config\Services::request();
        $data =  $request->getPost();
        $filepath = '';        
        $pet_id = $data['pet_id'];


        $pet_name_check = $petModel->where(array('pet_id !=' => $pet_id, 'pet_name' => $data['pet_name'], 'flag' => 1 ))->first();
        if(!$pet_name_check){

        $pet_check = $petModel->where('pet_id', $pet_id)->first();
         if($pet_check){
            if($_FILES['pet_img']['name'] != ''){
                $old_img=$pet_check['pet_img'];
                $img = $this->request->getFile('pet_img');
                if (!$img->hasMoved()) {
                    $newName = $img->getRandomName(); // Generate a random file name
                    $img->move('uploads/pet', $newName); // Move the file to the uploads directory
                    $data['pet_img']= 'uploads/pet/'.$newName; 
                    
                    if (file_exists($old_img)) {
                        unlink($old_img); // This will delete the file from the server
                    }
                }
                }
            $update = $petModel->save($data);
            if($data && $update){
                if($petModel->db->affectedRows()){
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
        }
        echo $this->response_message(false);
    } else{
        echo $this->response_message([
            'code' => 400,
            'msg' => "Pet name is already there try another name!"
        ]); return;
    }
    }


    public function deletePet(){
        $petModel = new PetModel;
        $request = \Config\Services::request();
        $data =  [
            'pet_id' => $request->getPost('pet_id'),
            'flag' => 0
        ];

        $delete_image =   $request->getPost('pet_img');
        $delete = $petModel->save($data);

        if($delete){

            if($petModel->db->affectedRows()){

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