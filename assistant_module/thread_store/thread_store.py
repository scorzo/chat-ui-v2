import shelve
import traceback

def check_if_thread_exists(lookup_id):
    if not lookup_id:
        return None  # Return None if lookup_id is falsy

    lookup_id_str = str(lookup_id)  # Convert lookup_id to string
    with shelve.open("threads_db") as threads_shelf:
        return threads_shelf.get(lookup_id_str, None)

def store_thread(lookup_id, thread_id, thread_name=None):
    with shelve.open("threads_db", writeback=True) as threads_shelf:
        if lookup_id is None:
            # Generate a new lookup_id by finding the maximum existing numeric id and incrementing it
            max_id = 0
            for key in threads_shelf.keys():
                try:
                    int_key = int(key)  # Convert keys to int for comparison
                    if int_key > max_id:
                        max_id = int_key
                except ValueError:
                    # If the key is not an integer, ignore it
                    continue
            lookup_id = max_id + 1  # Increment the highest id found
            print(f"New lookup_id created: {lookup_id}")

        if thread_name is None:
            thread_name = f"Thread {lookup_id}"  # Default thread name

        # Store the thread_name and thread_id under the new or existing lookup_id
        lookup_id_str = str(lookup_id)  # Convert lookup_id to string
        threads_shelf[lookup_id_str] = {
            "thread_name": thread_name,
            "thread_id": thread_id
        }
        print(f"Thread name '{thread_name}' and id '{thread_id}' stored with lookup_id '{lookup_id_str}'")

    return lookup_id_str, {"thread_name": thread_name, "thread_id": thread_id}  # Return the lookup_id and the dictionary

def name_thread(lookup_id, thread_name):
    with shelve.open("threads_db", writeback=True) as threads_shelf:
        lookup_id_str = str(lookup_id)  # Convert lookup_id to string
        if lookup_id_str in threads_shelf:
            threads_shelf[lookup_id_str]['thread_name'] = thread_name
            print(f"Thread name updated to '{thread_name}' for lookup_id '{lookup_id_str}'")
        else:
            print(f"No thread found with lookup_id '{lookup_id_str}'")

    return lookup_id_str, thread_name  # Return the lookup_id and the thread_name

def print_all_threads():
    with shelve.open("threads_db") as threads_shelf:
        # Iterate through all items in the shelf (key-value pairs)
        for lookup_id, thread_info in threads_shelf.items():
            print(f"Lookup ID: {lookup_id} has Thread Name: {thread_info['thread_name']} and Thread ID: {thread_info['thread_id']}")

def get_all_threads():
    """
    Retrieves all threads from the shelve database and returns them as a dictionary.

    Returns:
        dict: A dictionary where keys are lookup_ids and values are dictionaries with thread_name and thread_id.
    """
    try:
        with shelve.open("threads_db") as threads_shelf:
            threads_dict = {}
            for lookup_id, thread_info in threads_shelf.items():
                threads_dict[lookup_id] = thread_info
        return threads_dict
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()
        raise

if __name__ == '__main__':
    # This code block will only execute if the script is run directly
    print(f"Printing all threads:")
    print_all_threads()
