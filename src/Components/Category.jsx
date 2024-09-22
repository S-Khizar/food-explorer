import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Category = () => {
  const [data, setData] = useState([]); // Store the product list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Track the current page

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(
          `https://world.openfoodfacts.org/products.json?page=${page}&page_size=50`
        );
        setData((prevData) => [...prevData, ...response.data.products]); // Append new data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [page]); // Add page as a dependency to fetch new pages

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => window.removeEventListener('scroll', handleInfiniteScroll); // Clean up listener
  }, []);

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <div
          className="h-40 w-40 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_0.5s_linear_infinite]"
          role="status"
        ></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='flex flex-wrap items-center justify-around px-5 py-12 gap-x-6'>
      {data
        .filter((food) => food.product_name) // Filter out items without product_name
        .map((food) => (
          <div
            key={food._id}
            className='p-4 mt-3 border-2 rounded-lg shadow-md flex flex-col items-center w-72 hover:shadow-lg transition-shadow duration-300'
          >
            <p className='font-semibold text-lg mb-3'>{food.product_name}</p>
            <img
              src={food.image_front_small_url}
              className='w-40 h-40 object-cover rounded-lg mb-3'
              alt={food.product_name}
            />
            <div className='mb-3'>
              <p className='font-medium'>Categories:</p>
              {food.categories_hierarchy?.length > 0 ? (
                <ul className='list-disc ml-5'>
                  {food.categories_hierarchy.map((categ, id) => {
                    const category = categ.split(':')[1];
                    return <li key={id}>{category}</li>;
                  })}
                </ul>
              ) : (
                <p>No categories available</p>
              )}
            </div>
            <div className='mb-3'>
              <p className='font-medium'>Ingredients:</p>
              {food.ingredients_tags?.length > 0 ? (
                <ul className='flex flex-wrap list-none ml-0 gap-x-2'>
                  {food.ingredients_tags.map((ing, id) => {
                    const ingredientName = ing.split(':')[1];
                    return (
                      <li key={id}>
                        {ingredientName}
                        {id !== food.ingredients_tags.length - 1 && ','}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No ingredients available</p>
              )}
            </div>

            <p className='mt-2 font-medium text-sm'>
              Nutrition Grade: {food.nutrition_grades || 'Not available'}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Category;
