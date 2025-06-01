
export const getCustomerEvents = async (userId: string, roleId: string | number) => {
  try {
    console.log("Checking if user is customer. RoleId:", roleId, "Type:", typeof roleId);
    
    // Verify it's a customer (roleId === 1)
    if (Number(roleId) !== 1) {
      console.error("User is not a customer. RoleId:", roleId);
      throw new Error('User is not a customer');
    }

    // Fetch customer events
    console.log("Fetching events for customer:", userId);
    const url = `https://asia-southeast1-evntgarde-event-management.cloudfunctions.net/getCustomerEvents?user_id=${userId}`;
    console.log("Request URL:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch customer events. Status:", response.status, "Error:", errorText);
      throw new Error(`Failed to fetch customer events: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Successfully fetched customer events:", data);
    return data;
  } catch (error) {
    console.error('Error in getCustomerEvents:', error);
    throw error;
  }
};

export const getOrganizerEvents = async (userId: string, roleId: string | number) => {
  try {
    console.log("Checking if user is organizer. RoleId:", roleId, "Type:", typeof roleId);
    
    // Verify it's an organizer (roleId === 2)
    if (Number(roleId) !== 2) {
      console.error("User is not an organizer. RoleId:", roleId);
      throw new Error('User is not an organizer');
    }

    // Fetch organizer events
    console.log("Fetching events for organizer:", userId);
    const url = `https://asia-southeast1-evntgarde-event-management.cloudfunctions.net/getOrganizerEvents?user_id=${userId}`;
    console.log("Request URL:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch organizer events. Status:", response.status, "Error:", errorText);
      throw new Error(`Failed to fetch organizer events: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Successfully fetched organizer events:", data);
    return data;
  } catch (error) {
    console.error('Error in getOrganizerEvents:', error);
    throw error;
  }
}; 