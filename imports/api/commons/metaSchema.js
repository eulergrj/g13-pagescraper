import SimpleSchema from 'simpl-schema';

const MetaSchema = new SimpleSchema({
	userId: {
		type: String,
		optional: true,
		autoValue: function () {
			if(this.userId) {
				if (this.isInsert) {
					return this.userId;
				} else if (this.isUpsert) {
					return {$setOnInsert: this.userId };
				} else {
					this.unset();
				}
			}
		}
	},
	lastUpdatedByUserId: { type: String,
		optional: true,
		autoValue: function () {
			if(this.userId) {
				return this.userId;
			}
		}
	},
	createdAt: {
		type: Date,
		optional: true,
		autoValue: function () {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpsert) {
				return {$setOnInsert: new Date()};
			} else {
				this.unset();
			}
		}
	},
	updatedAt: {
		type: Date,
		optional: true,
		autoValue: function () {
			if (this.isUpdate) {
				return new Date();
			}
		},
		optional: true
	}
});

export default MetaSchema;
