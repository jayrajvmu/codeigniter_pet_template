<?php
namespace App\Models;
use CodeIgniter\Model;

class PetModel extends Model{
    protected $table = 'pet_tbl';
    protected $primaryKey = 'pet_id';
    protected $allowedFields = [
        'pet_name',
        'pet_img',
        'flag'
    ];
}