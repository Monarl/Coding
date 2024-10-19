import React from 'react';

const ProductInfo = ({ name = "Unknown Product", price = "N/A" }) => {
    return (
        <div className='flex flex-col items-center justify-center w-screen p-4'>
            <h2 className='text-2xl font-semibold'>{name}</h2>
            <p className='text-lg font-bold'>{price}</p>
            <form>
                <input className='bg-slate-600'/>
            </form>
        </div>
    );
};

export default ProductInfo;

