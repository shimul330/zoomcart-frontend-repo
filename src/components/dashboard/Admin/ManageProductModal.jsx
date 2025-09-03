import React from 'react';


const ManageProductModal = ({ register, errors, product, handleImageUpload, loading }) => {


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label className="font-medium">Name</label>
                    <input
                        type="text"
                        defaultValue={product.name}
                        {...register("name", { required: true })}
                        className="border p-2 rounded w-full"
                    />
                    {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium">Slug</label>
                    <input
                        type="text"
                        defaultValue={product.slug}
                        {...register("slug", { required: true })}
                        className="border p-2 rounded w-full"
                    />
                    {errors.slug && <span className="text-red-500 text-sm">Slug is required</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium">Price</label>
                    <input
                        type="number"
                        defaultValue={product.price}
                        {...register("price", { required: true })}
                        className="border p-2 rounded w-full"
                    />
                    {errors.price && <span className="text-red-500 text-sm">Price is required</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium">Status</label>
                    <select {...register("status")} className="border p-2 rounded w-full">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label className="font-medium">Discount (%)</label>
                    <input
                        type="number"
                        defaultValue={product.discount}
                        {...register("discount")}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div className="flex flex-col gap-1 relative">
                    <label className="font-medium">Photos</label>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        multiple
                        className="border p-2 rounded w-full"
                    />
                    {loading && (
                        <span className="text-blue-500 text-sm absolute top-full mt-1">
                            Uploading images...
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium">Stock Available</label>
                    <select {...register("stock", { valueAsBoolean: true })} defaultValue={product.stock} className="border p-2 rounded w-full">
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                    </select>
                </div>


                {/* Category as predefined options */}
                <div className="flex flex-col gap-1">
                    <label className="font-medium">Category</label>
                    <select {...register("category", { required: true })} defaultValue={product.category} className="border p-2 rounded w-full">
                        <option value="">Select Category</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Clock">Clock</option>
                        <option value="Light">Light</option>
                        
                    </select>
                    {errors.category && <span className="text-red-500 text-sm">Category is required</span>}
                </div>
            </div>
        </div>
    );
};

export default ManageProductModal;