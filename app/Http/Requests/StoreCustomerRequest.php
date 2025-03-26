<?php

namespace App\Http\Requests;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Get the product ID from the route
        return [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'name' => 'required|string|max:255|unique:' . Customer::class,
            'phone' => 'required|string|regex:/^09\d{9}$/',
            'address' => 'nullable',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Only JPEG, PNG, JPG, and GIF formats are allowed.',
            'image.max' => 'The image size must not exceed 20MB.',
            'name.required' => 'Customer name is required.',
            'name.unique' => 'A customer with this name already exists.',
            'phone.required' => 'Phone is required.',
            'phone.regex' => 'The phone number must be a valid PH number with 11 digits, starting with 09.',
        ];
    }
}