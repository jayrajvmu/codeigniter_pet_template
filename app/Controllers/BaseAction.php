<?php

namespace App\Controllers;

class BaseAction extends BaseController
{

    public function __construct(){
        if (!sessionCheck()) {
            return redirect()->to('/');
        }
    }
    
    public function index()
    {
        if (sessionCheck()) {
            return view('dashboard');
        }
        return view('login');
    }

    public function dashboard()
    {
        return view('dashboard');
    }

    public function product()
    {
        return view('product');
    }

    public function product_type()
    {
        return view('product_type');
    }

    public function product_category()
    {
        return view('product_category');
    }

    public function pet()
    {
        return view('pet');
    }

    public function brand()
    {
        return view('brand');
    }
    public function breed()
    {
        return view('breed');
    }

    ##############################################

    public function productDescription()
    {
        return view('product_desc');
    }

    public function profile()
    {
        return view('profile');
    }
    public function cart()
    {
        return view('cart');
    }
    public function wishlist()
    {
        return view('wishlist');
    }
    public function order()
    {
        return view('order');
    }
    public function checkout()
    {
        return view('checkout');
    }
    public function about()
    {
        return view('about');
    }
    public function contact()
    {
        return view('contact');
    }
    public function faq()
    {
        return view('faq');
    }
    public function privacypolicy()
    {
        return view('privacypolicy');
    }
    public function experience()
    {
        return view('experience');
    }
    public function addpet()
    {
        return view('addpet');
    }
    public function groomingcenter()
    {
        return view('groomingcenter');
    }
    public function consultationcenter()
    {
        return view('consultationcenter');
    }

    
}
