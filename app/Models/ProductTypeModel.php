<?php
namespace App\Models;
use CodeIgniter\Model;

class ProductTypeModel extends Model{
    protected $table = 'product_type_tbl';
    protected $primaryKey = 'product_type_id';
    protected $allowedFields = [
        'pet_id',
        'type',
        'flag'
    ];
}