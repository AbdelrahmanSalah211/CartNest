import { SelectQueryBuilder } from 'typeorm';

interface QueryParams {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: any;
}

export class APIFeatures<Entity> {
  private query: SelectQueryBuilder<Entity>;
  private queryParams: QueryParams;

  constructor(query: SelectQueryBuilder<Entity>, queryParams: QueryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter(): this {
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    const filters = { ...this.queryParams };
    excludedFields.forEach(field => delete filters[field]);

    Object.keys(filters).forEach(key => {
      if (typeof filters[key] === 'object') {
        const operators = filters[key];
        for (const op in operators) {
          const value = operators[op];
          const column = `${this.query.alias}.${key}`;
          switch (op) {
            case 'gte':
              this.query.andWhere(`${column} >= :${key}_gte`, { [`${key}_gte`]: value });
              break;
            case 'gt':
              this.query.andWhere(`${column} > :${key}_gt`, { [`${key}_gt`]: value });
              break;
            case 'lte':
              this.query.andWhere(`${column} <= :${key}_lte`, { [`${key}_lte`]: value });
              break;
            case 'lt':
              this.query.andWhere(`${column} < :${key}_lt`, { [`${key}_lt`]: value });
              break;
          }
        }
      } else {
        const column = `${this.query.alias}.${key}`;
        this.query.andWhere(`${column} = :${key}`, { [key]: filters[key] });
      }
    });

    return this;
  }

  sort(): this {
    if (this.queryParams.sort) {
      const sortFields = this.queryParams.sort.split(',');
      sortFields.forEach(field => {
        const direction = field.startsWith('-') ? 'DESC' : 'ASC';
        const column = `${this.query.alias}.${field.replace('-', '')}`;
        this.query.addOrderBy(column, direction);
      });
    } else {
      this.query.addOrderBy(`${this.query.alias}.createdAt`, 'DESC');
    }
    return this;
  }

  limitFields(): this {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',').map(field => `${this.query.alias}.${field}`);
      this.query.select(fields);
    }
    return this;
  }

  paginate(): this {
    const page = parseInt(this.queryParams.page || '1', 10);
    const limit = parseInt(this.queryParams.limit || '100', 10);
    const skip = (page - 1) * limit;

    this.query.skip(skip).take(limit);
    return this;
  }

  getQuery(): SelectQueryBuilder<Entity> {
    return this.query;
  }
}
