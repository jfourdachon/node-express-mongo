class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const exludedFields = ['page', 'sort', 'limit', 'fields'];
    exludedFields.forEach((elem) => delete queryObj[elem]);

    // 1B) Advanced filtering

    // { duration: { $gte: '5' }, difficulty: 'easy' } }     ->  mongoose filter
    // { duration: { gte: '5' }, difficulty: 'easy' } }      ->  params from postman (only miss '$')
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    //return the entire object to chains methods
    return this;
  }

  sort() {
    //2) Sorting (excluded in filtering)
    if (this.queryString.sort) {
      // sort('price,ratingsAverage') -> from postman
      // sort('price ratingsAverage') -> mongoose

      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //3) Limit fields to send to client
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //4) Pagination
    const page = this.queryString.page * 1 || 1; // convert string to number
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    // page=2&limit=5, 1-5 in page 1 and 6 to 10 in page 2...
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
