import { Card } from "antd";
import { motion } from "framer-motion";
const CategoryCardGrid = ({ categories }) => {
  return (
    <motion.div
      className="category-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        marginTop: "20px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category) => (
        <Card
          key={category.id}
          hoverable
          cover={
            <img
              alt={category.name}
              src={category.image}
              style={{ height: "200px", objectFit: "cover" }}
            />
          }
        >
          <Card.Meta
            title={category.name}
            description={`Slug: ${category.slug}`}
          />
        </Card>
      ))}
    </motion.div>
  );
};

export default CategoryCardGrid