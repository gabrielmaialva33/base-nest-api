import { ModelClass, ModelProps, PartialModelObject } from 'objection';
import { BaseEntity } from '@src/common/module/base.entity';

/**
 * ------------------------------------------------------
 * Zod Refinements (Custom Validators)
 * ------------------------------------------------------
 *
 * Validates if a given value is unique in the database for a specified field.
 *
 * @param entity The entity class to perform the query.
 * @param field The field name to check for uniqueness.
 * @param value The value to be checked. Should be a string or a type that can be meaningfully compared in the database.
 * @throws Throws an error if the database query fails.
 * @returns True if the value is unique, false otherwise.
 */
export const isUnique = async <T extends BaseEntity>(
  entity: ModelClass<T>,
  field: ModelProps<T>,
  value: string | number,
): Promise<boolean | Error> => {
  if (!value || typeof value !== 'string' || value.trim() === '') return false;
  if (field === 'id') new Error('Cannot check uniqueness for "id" field');

  try {
    const count = await entity
      .query()
      .where({ [field]: value })
      .resultSize();

    return count === 0;
  } catch (error) {
    // Log and handle the error appropriately
    throw new Error('Failed to validate uniqueness due to a database error');
  }
};

/**
 * Checks if a record exists in the database that matches the given criteria.
 *
 * @param entity The entity class to perform the query.
 * @param clause The criteria used to find the record. Should be a partial object of the entity type.
 * @throws Throws an error if the database query fails.
 * @returns False if at least one record exists that matches the criteria, true otherwise.
 */
export const isExists = async <T extends BaseEntity>(
  entity: ModelClass<T>,
  clause: PartialModelObject<T>,
): Promise<boolean | Error> => {
  if (!clause || Object.keys(clause).length === 0)
    throw new Error('Invalid search criteria provided');

  // If any of the values are undefined, return true
  if (Object.values(clause).some((value) => value === undefined)) return true;

  try {
    const count = await entity.query().where(clause).resultSize();

    return count === 0;
  } catch (error) {
    // Log and handle the error appropriately
    throw new Error('Failed to validate existence due to a database error');
  }
};
