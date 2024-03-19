import { Document, FilterQuery } from 'mongoose';

class APIFeatures<T extends Document> {
  query:any;
  queryString:any;
  constructor (query:unknown, queryString:unknown) {
      this.query = query;
      this.queryString = queryString;
  }

  filter (): this {
      const queryObj = {...this.queryString};
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(item => delete queryObj[item]);

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
   

      this.query.find(JSON.parse(queryStr) as FilterQuery<T>);
      return this;
  }

  sort (): this {
      if(this.queryString.sort) {
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy)
      }
      return this;
  }

  limitFields (): this {
    if(this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
    } else {
        this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination (): this {
      const page = this.queryString.page * 1 || 1;
      const pageSize = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * pageSize;
      this.query = this.query.skip(skip).limit(pageSize)
      return this;
  }

}

export default APIFeatures;
