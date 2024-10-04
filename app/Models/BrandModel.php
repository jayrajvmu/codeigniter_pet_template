<?php
namespace App\Models;
use CodeIgniter\Model;

class BrandModel extends Model{
    protected $table = 'brand_tbl';
    protected $primaryKey = 'brand_id';
    protected $allowedFields = [
        'brand_name',
        'brand_logo',
        'flag'
    ];
}