# Neo4j Team Agent Test Scenario

## Test Case: E-commerce Product Catalog

This test validates that our generic Neo4j agents can handle any domain by modeling a simple e-commerce product catalog.

### Domain Entities
- **Product**: Items for sale
- **Category**: Product classifications  
- **Brand**: Product manufacturers
- **Customer**: People who buy products
- **Order**: Purchase transactions

### Test Data Sample
```
Product: "laptop-001"
- Name: "Gaming Laptop Pro"
- Description: "High-performance gaming laptop with RTX graphics"
- Price: 1299.99
- Category: "Electronics > Computers"
- Brand: "TechCorp"

Category: "electronics"
- Name: "Electronics" 
- Description: "Electronic devices and gadgets"

Brand: "techcorp"
- Name: "TechCorp"
- Description: "Leading technology manufacturer"
```

### Expected Relationships
- Product BELONGS_TO Category
- Product MANUFACTURED_BY Brand
- Customer PURCHASED Product (via Order)
- Product HAS_ALIAS (alternative names)
- Product HAS_EXAMPLE (usage scenarios)

This test will verify that all agents can work with this non-CAT-MIP domain.