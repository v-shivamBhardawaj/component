import axios from "axios";
import React, { useEffect, useState } from "react";

const BeanList = () => {
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBeans = async () => {
      try {
        // Make sure the endpoint matches your Express API
        const response = await axios.get("http://localhost:3001/api/users"); // Change the URL if your server is hosted elsewhere
        setBeans(response.data);
      } catch (err) {
        setError("Failed to fetch beans");
      } finally {
        setLoading(false);
      }
    };

    fetchBeans();
  }, []);

  if (loading) return <div>Loading....</div>;
  if (error) return <div>{error}</div>;

  const addToCart = async (bean) => {
    try {
      await axios.post("http://localhost:3001/api/cart", {
        beanId: bean.beanId,
        flavorName: bean.flavorName,
      });
      alert(`${bean.flavorName} added to cart!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {beans.map((bean) => (
        <li
          key={bean.beanId}
          style={{
            backgroundColor: bean.backgroundColor,
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            textAlign: "left",
          }}
        >
          <img
            src={bean.imageUrl}
            alt={bean.flavorName}
            style={{ width: "100px", height: "100px" }}
          />
          <h3>{bean.flavorName}</h3>
          <p>{bean.description}</p>
          <p>
            <strong>Group Name:</strong> {bean.groupName.join(", ")}
          </p>
          <p>
            <strong>Ingredients:</strong> {bean.ingredients.join(", ")}
          </p>
          <p>
            <strong>Gluten Free:</strong> {bean.glutenFree ? "Yes" : "No"}
          </p>
          <p>
            <strong>Sugar Free:</strong> {bean.sugarFree ? "Yes" : "No"}
          </p>
          <p>
            <strong>Kosher:</strong> {bean.kosher ? "Yes" : "No"}
          </p>
          <button onClick={() => addToCart(bean)}>Add to Cart</button>
        </li>
      ))}
    </ul>
  );
};

export default BeanList;
