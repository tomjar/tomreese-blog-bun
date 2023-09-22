const PostCategoryEnum = {
    Bicycle: 'bicycle',
    Code: 'code',
    Gaming: 'gaming',
    Hardware: 'hardware',
    Life: 'life',
    Review: 'review'
};

const NameValueEnumArr = [
    { 'value': PostCategoryEnum.Bicycle.toLowerCase(), 'name': PostCategoryEnum.Bicycle.toLowerCase() },
    { 'value': PostCategoryEnum.Code.toLowerCase(), 'name': PostCategoryEnum.Code.toLowerCase() },
    { 'value': PostCategoryEnum.Gaming.toLowerCase(), 'name': PostCategoryEnum.Gaming.toLowerCase() },
    { 'value': PostCategoryEnum.Hardware.toLowerCase(), 'name': PostCategoryEnum.Hardware.toLowerCase() },
    { 'value': PostCategoryEnum.Life.toLowerCase(), 'name': PostCategoryEnum.Life.toLowerCase() },
    { 'value': PostCategoryEnum.Review.toLowerCase(), 'name': PostCategoryEnum.Review.toLowerCase() }
];


export default {PostCategoryEnum, NameValueEnumArr};