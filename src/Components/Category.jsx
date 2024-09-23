import React, { useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce'; 

const Category = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); 
  const [isFetching, setIsFetching] = useState(false); 
  const [sortOption, setSortOption] = useState('nutrition-grade-asc'); // Default sort option

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setIsFetching(true); 
        const response = await axios.get(
          `https://world.openfoodfacts.org/products.json?page=${page}&page_size=40`
        );
        setData((prevData) => [...prevData, ...response.data.products]); 
        setError(null); 
      } catch (error) {
        setError(error.message);
      } finally {
        setIsFetching(false);
        setLoading(false);
      }
    };
    fetchInfo();
  }, [page]);

  // Scroll event listener with debounce to reduce frequent event firing
  useEffect(() => {
    const debouncedHandleScroll = debounce(handleInfiniteScroll, 300);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll); 
  }, []);

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (!isFetching) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  // Handle sorting option change
  const handleSortChange = (event) => {
    setSortOption(event.target.value); // Trigger re-render on sort change
  };

  // Sort data based on selected option
  const sortedData = [...data].sort((a, b) => {
    const productNameA = a.product_name?.toLowerCase() || '';
    const productNameB = b.product_name?.toLowerCase() || '';
    
    const nutritionGradeA = a.nutrition_grades || ''; 
    const nutritionGradeB = b.nutrition_grades || '';
  
    switch (sortOption) {
      case 'product-name-asc':
        return productNameA.localeCompare(productNameB); 
      case 'product-name-desc':
        return productNameB.localeCompare(productNameA); 
      case 'nutrition-grade-asc':
        return nutritionGradeA.localeCompare(nutritionGradeB); 
      case 'nutrition-grade-desc':
        return nutritionGradeB.localeCompare(nutritionGradeA); 
      default:
        return 0;
    }
  });

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
    <>
      {/* Sorting options */}
      <div className="flex justify-center mb-4">
        <label className="mr-2 font-semibold">Sort by:</label>
        <select
          className="p-2 border rounded-lg"
          value={sortOption}
          onChange={handleSortChange} // Re-trigger sort on change
        >
          <option value="product-name-asc">Product Name (A-Z)</option>
          <option value="product-name-desc">Product Name (Z-A)</option>
          <option value="nutrition-grade-asc">Nutrition Grade (Ascending)</option>
          <option value="nutrition-grade-desc">Nutrition Grade (Descending)</option>
        </select>
      </div>

      {/* Product List */}
      <div className='flex flex-wrap items-center justify-around px-5 py-12 gap-x-6'>
        {sortedData
          .filter((food) => food.product_name)
          .map((food,index) => (
            <div
              key={`${food._id}-${index}`}
              className='p-4 mt-3 border-2 rounded-lg shadow-md flex flex-col items-center w-80 h-96 hover:shadow-lg transition-shadow duration-300 overflow-hidden'
            >
              <p className='font-semibold text-lg mb-3 text-center'>{food.product_name}</p>
              <img
                src={food.image_front_small_url}
                className='w-40 h-40 object-cover rounded-lg mb-3'
                alt={food.product_name}
              />
              <div className='flex-1 overflow-auto'>
                <div className='mb-3'>
                  <p className='font-medium'>Categories:</p>
                  {food.categories_hierarchy?.length > 0 ? (
                    <ul className='flex flex-wrap list-none ml-0 gap-x-2'>
                      {food.categories_hierarchy.map((categ, id) => {
                        const category = categ.split(':')[1];
                        return <li key={id}>{category}{id !== food.categories_hierarchy.length - 1 && ','}</li>;
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
              </div>
              <p className='mt-2 font-medium text-sm'>
                Nutrition Grade: {food.nutrition_grades || 'Not available'}
              </p>
            </div>
          ))}
        {isFetching && (
          <div className="flex justify-center items-center mt-4">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_0.5s_linear_infinite]"
              role="status"
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
