// 初始化分类下拉菜单
export const initCategoriesDropdown = () => {
  const dropdown = document.getElementById('categoriesDropdown');
  const dropdownContent = dropdown?.querySelector('.dropdown-content');
  let timeoutId: ReturnType<typeof setTimeout>;

  if (!dropdown || !dropdownContent) return;

  const showDropdown = () => {
    clearTimeout(timeoutId);
    dropdownContent.classList.add('show');
  };

  const hideDropdown = () => {
    timeoutId = setTimeout(() => {
      dropdownContent.classList.remove('show');
    }, 200);
  };

  dropdown.addEventListener('mouseenter', showDropdown);
  dropdown.addEventListener('mouseleave', hideDropdown);
  dropdownContent.addEventListener('mouseenter', showDropdown);
  dropdownContent.addEventListener('mouseleave', hideDropdown);
}; 