<?php
namespace App\Models;
use CodeIgniter\Model;

class ProductCategoryModel extends Model{
    protected $table = 'product_category_tbl';
    protected $primaryKey = 'product_category_id';
    protected $allowedFields = [
        'product_type_id',
        'category',
        'flag'
    ];
}