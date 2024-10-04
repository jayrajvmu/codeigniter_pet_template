<?php

namespace App\Models;
use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'product_tbl';
    protected $primaryKey = 'product_id';
    protected $allowedFields = [
        'brand_id',
        'pet_id',
        'breed_id',
        'product_type_id',
        'product_category_id',
        'name',
        'summery',
        'description',
        'instruction',
        'product_json',
        'flag'
    ];
}