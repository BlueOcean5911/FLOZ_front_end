
const PeopleIcon = ({...rest}) => {
  return (
    <svg {...rest} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" fill="white" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" stroke="#747474" />
      <path fillRule="evenodd" clipRule="evenodd" d="M23.3864 21.2307V21.9076C23.3864 22.7076 22.7095 23.3845 21.9095 23.3845H10.0941C9.29411 23.3845 8.61719 22.7076 8.61719 21.9076V21.2307C8.61719 19.446 10.7095 18.3384 12.6787 17.4768L12.8633 17.3845C13.0172 17.323 13.171 17.323 13.3249 17.4153C14.1249 17.9384 15.0172 18.2153 15.971 18.2153C16.9249 18.2153 17.848 17.9076 18.6172 17.4153C18.771 17.323 18.9249 17.323 19.0787 17.3845L19.2633 17.4768C21.2941 18.3384 23.3864 19.4153 23.3864 21.2307ZM16.0018 8.61523C18.0326 8.61523 19.6634 10.4306 19.6634 12.6768C19.6634 14.9229 18.0326 16.7383 16.0018 16.7383C13.9711 16.7383 12.3403 14.9229 12.3403 12.6768C12.3403 10.4306 13.9711 8.61523 16.0018 8.61523Z" fill="#7A7A7A" />
    </svg>
  )
}

export default PeopleIcon;